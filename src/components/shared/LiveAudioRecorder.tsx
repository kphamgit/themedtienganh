import { useEffect } from 'react';
import { useAudioRecorder } from 'react-audio-voice-recorder';
import { v4 as uuidv4 } from 'uuid';
import { upload_form_data_to_s3, upload_to_openAI_for_recognition } from '../../services/list';
import { useAppSelector } from '../../redux/store';

const MyComponent = () => {
  const {
    startRecording,
    stopRecording,
    recordingBlob,
    isRecording,
    isPaused,
    recordingTime,
    
  } = useAudioRecorder();

const user = useAppSelector(state => state.user.value)

/*
  useEffect(() => {
    if (recordingBlob) {
      // Handle the recorded audio blob
      const audioUrl = URL.createObjectURL(recordingBlob);
      const audio = new Audio(audioUrl);
      audio.play();

      //  also send the blob to a server for storage
      console.log("send...")
           const newUuid = uuidv4();
             const fileName = `${newUuid}-${user.user_name}`;
             //console.log("LIveAudioRecrodefileName=", fileName)
             const myFile = new File([recordingBlob as Blob], fileName, {
                    type: (recordingBlob as Blob).type,
             });
             const formData = new FormData();
             const s3_file_path =  `audios/recordings/${user.user_name}`
             formData.append("s3_file_path", s3_file_path)
             formData.append("file", myFile);
             const config = {
                 headers: {
                     'content-type': 'multipart/form-data',
                 },
             };
             //setBlob(undefined)
             upload_form_data_to_s3(formData, config)
             .then((response) => {
            
              //console.log("response=", response)
              if (response.message.includes("OK")) {
                //console.log("response.message=", response.message)
                alert("Audio sent!")
           
              }
             })
    }
  }, [recordingBlob]);
*/

useEffect(() => {
  if (recordingBlob) {
    // Handle the recorded audio blob
    const audioUrl = URL.createObjectURL(recordingBlob);
    const audio = new Audio(audioUrl);
    audio.play();

    //  also send the blob to a server for storage
    console.log("send...")
         const newUuid = uuidv4();
           const fileName = `${newUuid}-${user.user_name}`;
           //console.log("LIveAudioRecrodefileName=", fileName)
           const myFile = new File([recordingBlob as Blob], fileName, {
                  type: (recordingBlob as Blob).type,
           });
           const formData = new FormData();
         
           console.log("xxxxXXXXXXXXX myFile=", myFile)
           formData.append("audio", myFile);
           const config = {
               headers: {
                   'content-type': 'multipart/form-data',
               },
           };
           //setBlob(undefined)
           upload_to_openAI_for_recognition(formData, config)
           .then((response) => {
          
            //console.log("response=", response)
            //if (response.message.includes("OK")) {
              console.log("response=", response)
              alert("Audio sent!")
         
           // }
           })
  }
}, [recordingBlob]);

  if (!isRecording) {
    return (
      <div className='flex flex-row justify-start mx-2 p-2 text-sm'>
      <button className='bg-green-600 text-yellow-200 font-bold rounded-md p-2' onClick={startRecording} disabled={isRecording}>
      Start Recording
    </button>
  
    </div>
    )
  }
  
    return (
      <div className='flex flex-row justify-start mx-2 p-2 gap-2 text-sm'>
      
      <button className='bg-red-400 text-white font-bold rounded-md p-2' onClick={stopRecording} disabled={!isRecording}>
        Stop Recording
      </button>
      <p>{isRecording ? 'Listening...' : ''}</p>
      </div>
    )
  
  /*
  return (
    <div>
      <p>Recording status: {isRecording ? 'Recording' : 'Idle'}</p>
      <p>Paused: {isPaused ? 'Yes' : 'No'}</p>
      <p>Recording time: {recordingTime} seconds</p>
      
      <button onClick={startRecording} disabled={isRecording}>
        Start Recording
      </button>
      <button onClick={stopRecording} disabled={!isRecording}>
        Stop Recording
      </button>
    </div>
  );
  */
};

export default MyComponent;