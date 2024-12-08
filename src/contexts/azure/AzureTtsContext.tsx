import { Dispatch, ReactNode, SetStateAction,useState, createContext } from "react"
import { SpeechConfig, 
   } from 'microsoft-cognitiveservices-speech-sdk';

export type AzureTtspeech = {
   config: SpeechConfig
}

export interface TtSpeechContextInterface {
    ttSpeechConfig: AzureTtspeech,
    setTtSpeechConfig: Dispatch<SetStateAction<AzureTtspeech>>
}

//React.Dispatch<React.SetStateAction<boolean>>]
//const [flipped, setFlipped] = useState<boolean>(false)
//const [user, setUser] = useState<User>();
// const []
const defaultState = {
    ttSpeechConfig: {
        config: {}
    }
} as TtSpeechContextInterface
//export const UserContext = createContext<Partial<UserContextInterface>>({})

export const TtSpeechContext = createContext(defaultState)

type TtSpeechProviderProps = {
    children: ReactNode
}
export default function TtSpeechProvider({children} : TtSpeechProviderProps)
{
    const [ttSpeechConfig, setTtSpeechConfig] = useState<AzureTtspeech>({
      config: SpeechConfig.fromSubscription('0a1e83a35c7642c49b193de23611e07f', 'eastus')
    })

    return (
        <TtSpeechContext.Provider value = {{ttSpeechConfig, setTtSpeechConfig }}>
            {children}
        </TtSpeechContext.Provider>
    )
}
/*
seEffect(() => {
        const azureSpeechConfig = SpeechConfig.fromSubscription('0a1e83a35c7642c49b193de23611e07f', 'eastus');
        azureSpeechConfig.speechSynthesisVoiceName = "en-US-JasonNeural"
        azureSpeechConfig.speechSynthesisOutputFormat = SpeechSynthesisOutputFormat.Audio16Khz32KBitRateMonoMp3
        
        setTtSpeechConfig({config: azureSpeechConfig})
    },[setTtSpeechConfig])
//setUser({user_name: 'test', l
*/

