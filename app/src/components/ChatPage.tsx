import { useCallback, useMemo, useRef, useState } from "react"
import { buildStream, useChat } from "./useChat"
import { v4 as uuidv4 } from "uuid";
import { useSession } from "next-auth/react";

interface Message {
    id: string;
    text: string;
    type: string;
    created_at: Date;
    sent_by: string;
}
const source = buildStream<Message>((controller) => {
    setInterval(() => {
        console.log("enqueue...")
        const date = new Date()
        const message = {created_at: date, id: date.toISOString(), text: "new message", type: "text", sent_by: "2", }
        controller.enqueue(message)
    }, 1000)
})

export const ChatPage: React.FC = () => {
    const [text, setText] = useState("");
    const { data } = useSession();

    const onSend = useCallback(async (msg: Message) => {
        // TODO: send message from api
        return new Promise<Message>((resolve, reject) => {
            setTimeout(() => {
                const random = Math.random()
                if (random > 0.5) {
                    resolve(msg)
                    return;
                }
                reject("error sending message.")
            }, 1000);
        });
    }, []);

    const { sendMessage, messages } = useChat(source, onSend)

    return (
        <div className="flex flex-1 flex-col bg-gray-700">
            <pre className="flex flex-[1_0_0] text-xs overflow-y-scroll">
                {JSON.stringify(messages, null, 2)}
            </pre>
            <form className="flex flex-row rounded-md overflow-hidden" onSubmit={(e) => {
                e.preventDefault();
                if (text.trim() !== "") {
                    sendMessage({ created_at: new Date(), id: uuidv4(), sent_by: data?.user.uid ?? "", text, type: "text" })
                    setText("");
                }
            }}>
                <input value={text} type="text" placeholder="Message" onChange={(e) => setText(e.target.value)} className="p-2 px-3 flex-1 text-black" />
                <button className="bg-blue-500 px-2">Send</button>
            </form>
        </div>
    )
}