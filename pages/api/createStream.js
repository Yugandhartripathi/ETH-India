export default async function handler( req, res ) {
  const { name, profiles } = req.body;

  try {
    const response = await fetch(`https://livepeer.studio/api/stream`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer 1db1fc61-3ce4-438f-9a5a-9a1397c8a1bd`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify( {
        name,
        profiles
      } )
    } );
    
    const data = await response.json()
    return res.status(200).json(data)

  } catch (error) {
    console.log(error);
  }

}