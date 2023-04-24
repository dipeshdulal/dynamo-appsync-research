import { useCallback, useMemo, useState } from "react"
import { useChat } from "./useChat"
import { v4 as uuidv4 } from "uuid";
import { useSession } from "next-auth/react";
import { client } from "@/client"
import { gql } from "@apollo/client";

interface Message {
    id: string;
    text: string;
    type: string;
    created_at: Date;
    sent_by: string;
}


export const ChatPage: React.FC = () => {
    const [text, setText] = useState("");
    const { data } = useSession();

    const onSend = useCallback(async (msg: Message) => {

        const response = await client.mutate({
            mutation: gql`mutation message($id: ID!,$text: String, $type: String) {
                createChatMessage(messageId: $id, message: $text, roomId:"123", type: $type) {
                  ChatId
                  CreatedAt
                  Message
                  RoomId
                  Sender
                  Type
                }
              }`,
              variables: {
                text: msg.text,
                type: msg.type,
                id: msg.id
              },
            context: {
                headers: {
                    authorization: `Bearer ${data?.accessToken}`
                }
            }
        })
        const msgResponse = response?.data?.createChatMessage;
        return {...msg, sent_by: msgResponse.sender}
    }, [data?.accessToken]);

    const source = useMemo(() => {
        const obs = client.subscribe({
            query: gql`subscription subscribeToMessage{
            subscribeToChatMessageCreate(RoomId:"123") {
                Type
                ChatId
                Message
                RoomId
                Sender
                CreatedAt
            }
          }`,
        });
        return obs.map(m => {
           const msg = m.data?.subscribeToChatMessageCreate as any;
           return {
                id: msg.ChatId,
                text: msg.Message,
                type: msg.Type,
                created_at: msg.CreatedAt,
                sent_by: msg.Sender,
           }
        })
    }, [])

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