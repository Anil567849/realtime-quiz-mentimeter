import { useState } from "react";
import { UserNotAuth } from "../components/UserNotAuth";
import { UserAuth } from "../components/UserAuth";


export const User = () => {
    const [submitted, setSubmitted] = useState(false);
    const [name, setName] = useState("");
    const [code, setCode] = useState("");

    if (!submitted) {
        return <UserNotAuth setSubmitted={setSubmitted} setName={setName} setCode={setCode} name={name} code={code}/>
    }
    return <UserAuth code={code} name={name} />

}

