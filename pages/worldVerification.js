import React, { useState } from 'react'
import wc from '@worldcoin/id' // Import the worldcoin-lib library

function worldVerification() {
  const [address, setAddress] = useState('') // State variable for the Worldcoin address
  const [message, setMessage] = useState('') // State variable for the signed message
  const [signature, setSignature] = useState('') // State variable for the signature

  // Function to handle the submission of the signed message and signature
  async function handleSubmit() {
    try {
      // Verify the signed message using the worldcoin-lib library
      const isValid = wc.Message.verify(message, address, signature)

      if (isValid) {
        // If the signed message is valid, show a success message
        alert('Verification successful! The signed message is valid.')
      } else {
        // If the signed message is not valid, show an error message
        alert('Verification failed. The signed message is not valid.')
      }
    } catch (error) {
      // Handle any errors that occurred during the verification process
      alert(`An error occurred: ${error.message}`)
    }
  }

  return (
    <div>
      <h1>Worldcoin Frontend Verification</h1>
      <WorldIDWidget
        actionId="wid_BPZsRJANxct2cZxVRyh80SFG" // obtain this from developer.worldcoin.org
        signal="my_signal"
        enableTelemetry
        onSuccess={(verificationResponse) => console.log(verificationResponse)} // pass the proof to the API or your smart contract
        onError={(error) => console.error(error)}
        debug={true} // to aid with debugging, remove in production
      />
    </div>
  )
}

export default worldVerification
