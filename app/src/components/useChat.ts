import { Observable } from "@apollo/client";
import { useCallback, useEffect, useState } from "react";

interface BaseMessage {
    id: string;
    error?: string;
    is_loading?: boolean;
}

type SendMessage<T extends BaseMessage> = (message: T) => Promise<T>;

const reconcile = <T extends BaseMessage>(msgSource: Array<T>, msg: T): Array<T> => {
    const record = new Map<String, number>(); 
    const source = [...msgSource];
    for(let i = 0; i < msgSource.length; i++) {
        const m = msgSource[i];
        if(!record.has(m.id)){
            record.set(m.id, i);
        }
    }

    if(record.has(msg.id)) {
        const index = record.get(msg.id)!;
        source[index] = msg;
    } else {
        source.push(msg);
    }

    return source;
}


export const useChat = <T extends BaseMessage>(source: Observable<T>, send: SendMessage<T>) => {
    const [messages, setMessages] = useState<Array<T>>([]);

    const sendMessage = useCallback(async (message: T) => {
        try {
            setMessages((m) => reconcile(m, {...message, is_loading: true}));
            const msg = await send(message);
            setMessages((m) => reconcile(m, msg));
        }catch(e) {
            setMessages((m) => reconcile(m, {...message, error: e, is_loading: false}))
        }
    }, [send])

    useEffect(() => {
        const subscription = source.subscribe((data) => {
            if (data) {
                setMessages(m => reconcile(m, data))
            }
        });
        return () => {
            subscription.unsubscribe();
        }
    }, [source])

    return { messages, sendMessage }
}