import { signIn, signOut, useSession } from "next-auth/react"

export default function Index() {
    const { data: session } = useSession();
    console.log(session)
    if (!session) {
        return (
            <>
                Not signed in <br />
                <button onClick={() => signIn()}>Sign In</button>
            </>
        )
    }
    return (
        <>
            Signed in as {session.user?.name} <br />
            <button onClick={() => signOut()}>Sign Out</button>
        </>
    )
}