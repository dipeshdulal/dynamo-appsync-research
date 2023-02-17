import { ChatPage } from "@/components/ChatPage";
import { signIn, signOut, useSession } from "next-auth/react"

export default function Index() {
    const { data: session } = useSession();

    if (!session) {
        return (
            <div className="bg-gray-900 text-white w-screen h-screen flex flex-col justify-center items-center">
                <button className="bg-blue-500 p-2 rounded" onClick={() => signIn()}>Sign In</button>
            </div>
        )
    }

    return (
        <div className="bg-gray-900 text-white w-screen h-screen flex flex-col justify-center items-stretch">
            <div className="flex items-center">
                <p className="mr-2">Signed in as {session.user?.name}</p>
                <button className="bg-red-500 rounded p-1" onClick={() => signOut()}>Sign Out</button>
            </div>
            <ChatPage />
        </div>
    )
}