# 1 - Project descriptions

Webservice for PDF AI

# 2 - Installation and project setup

## 2.1 Packages

To install the required packages, run inside the project directory :

```bash
npm install
```

## 2.2 Environment variables

Create a `.env` file , copy the following variables add fill with corresponding informations :

```js
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

REPLICATE_AUTH=
```

# 3 - Walk-through
This application has to main routes : 

## 3.1 Chat  (/api/chat)
Chat routes contains all chat process like inserting document , initializing chat , interacting with document 
```ts
POST     /api/chat/setup-file // inserting document 

// CORE
export const setupFileHandler = async (req: Request, res: Response) => {
  try {
    const [fileType, fileId, document, filename] = [
      req.body.file_type,
      req.body.file_id,
      req.file,
      req.body.filename,
    ];

    // Check if fileType and fileId are provided
    if (!fileType || !fileId) {
      throw new Error("Invalid data");
    }
    
    let response;
    let base64 = "";
    
    // Based on the fileType, handle the file accordingly
    switch (fileType) {
      case "pdf":
        // If the file type is PDF, convert the file to base64
        if (!document) throw new Error("Invalid data");
        base64 = await fileToBase64(document.filename);
        // Send a POST request to process the PDF data
        response = await axios.post(
          "https://stage.aipdf.ai/ai-server/api/process-data-pdf",
          {
            file_id: fileId,
            pdf_data_b64: base64,
            pdf_filename: filename,
          }
        );
        break;
      case "epub":
        // If the file type is EPUB, convert the file to base64
        if (!document) throw new Error("Invalid data");
        base64 = await fileToBase64(document.filename);
        // Send a POST request to process the EPUB data
        response = await axios.post(
          "https://stage.aipdf.ai/ai-server/api/process-data-epub",
          {
            file_id: fileId,
            epub_data_b64: base64,
            epub_filename: filename,
          }
        );
        break;
      case "url":
        // If the file type is URL, extract the URL from the request body
        const url = req.body.url;
        // Send a POST request to process the URL data
        response = await axios.post(
          "https://stage.aipdf.ai/ai-server/api/process-data-url",
          {
            file_id: fileId,
            url,
          }
        );
        break;
      default:
        break;
    }
    
    // If there's a document, delete it after processing
    if (document) deleteFile(document.filename);

    // Send a success response
    return res.status(200).send("Document processed successfully");
  } catch (error: any) {
    // Handle errors and send an error response
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};

// USAGE 
const formData = new FormData();
formData.append('file_type', 'pdf'); // Specify the type of file ('pdf', 'epub', or 'url')
formData.append('file_id', '123456'); // Unique identifier for the file
formData.append('filename', 'example.pdf'); // Name of the file
formData.append('file', file); // Add your file here if necessary

// Make the POST request to the API endpoint
axios.post('/api/chat/setup-file', formData)
  .then(response => {
    console.log('Response:', response.data);
    // Handle response if necessary
  })
  .catch(error => {
    console.error('Error:', error.response.data);
    // Handle error if necessary
  });
```

```js
POST     /api/chat/init // initalizing chat 

// CORE
export const initChatHandler = async (req: Request, res: Response) => {
  try {
    // Extract data from the request body
    const data = {
      chat_id: req.body.chat_id,                // Unique identifier for the chat
      query: req.body.query,                    // User's query or message
      file_id: req.body.file_id,                // Identifier for the file (if any)
      demo_chat: req.body.demo_chat,            // Flag indicating if it's a demo chat
      is_suggested_question: true,              // Flag indicating if it's a suggested question
    };
    
    // Send a POST request to initialize the chat
    const response = await axios.post(
      "https://stage.aipdf.ai/ai-server/api/chat-initial",
      data
    );
    
    // Log the response data and send it back in the response
    console.log(response.data);
    return res.status(200).json(response.data);
  } catch (error: any) {
    // Handle errors and send an error response
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};

// USAGE
axios.post(
  "/api/chat/init",
  {
    chat_id: "",          // Unique identifier 
    query: "",              // User's query or 
    file_id: "",          // Identifier for the 
    demo_chat: false,      // Flag indicating if 
    is_suggested_question: true,        // Flag indicating if 
  }
)
.then(response => {
  console.log(response.data);
  return res.status(200).json(response.data);
})
.catch(error => {
  console.error(error.message);
  return res.status(500).json({ message: error.message });
});
```
```ts
POST     /api/chat/regular // interact with document 

// CORE 
export const regularChatHandler = async (req: Request, res: Response) => {
  try {
    // Extract data from the request body
    const data = {
      chat_id: req.body.chat_id,                    // Unique identifier for the chat
      query: req.body.query,                        // User's query or message
      file_id: req.body.file_id,                    // Identifier for the file (if any)
      doc_lang: req.body.doc_lang,                  // Document language (if applicable)
      conversation: req.body.conversation,          // Previous conversation context
      is_suggested_question: req.body.is_suggested_question, // Flag indicating if it's a suggested question
    };
    
    // Log the extracted data
    console.log(data);
    
    // Send a POST request to continue the chat
    const response = await axios.post(
      "https://stage.aipdf.ai/ai-server/api/chat-continue",
      data
    );
    
    // Return the response from the API
    return res.status(200).json(response.data);
  } catch (error: any) {
    // Handle errors and send an error response
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};

// USAGER 
axios.post(
  "/api/chat/regular",
  {
    chat_id: "",                    // Unique identifier for the chat
    query: ,                        // User's query or message
    file_id: "",                    // Identifier for the file (if any)
    doc_lang: "",                  // Document language (if applicable)
    conversation: "",          // Previous conversation context
    is_suggested_question: "", // Flag indicating if it's a suggested question
  }
)
.then(response => {
  return res.status(200).json(response.data);
})
.catch(error => {
  console.error(error.message);
  return res.status(500).json({ message: error.message });
});
```
```ts
GET      /api/chat/documents // get all documents , this must with parameter email 

// CORE
export const getDocumentList = async (req: Request, res: Response) => {
  try {
    // Extract email from query parameters
    const { email } = req.query;
    
    // Check if email is provided
    if (!email) throw new Error("Invalid data");
    
    // Query Firestore for documents with the specified email
    const pdfsRef = firestore.collection("pdfs");
    const pdfsSnapshot = await pdfsRef.where("email_id", "==", email).get();
    
    // Extract data from Firestore documents
    const pdfDocs = pdfsSnapshot.docs;
    const pdfData: any[] = [];
    pdfDocs.forEach((element) => {
      pdfData.push({ ...element.data(), _id: element.id });
    });
    
    // Return the list of documents
    return res.status(200).json(pdfData);
  } catch (error) {
    // Handle errors and send an error response
    console.error(error);
    return res.status(500).send("Failed processing this task");
  }
};
// USAGE
axios.get('/api/chat/documents', {
  params: {
    email: email
  }
})
.then(response => {
  console.log('Document list:', response.data);
  // Handle the document list if necessary
})
.catch(error => {
  console.error('Error:', error.response.data);
  // Handle error if necessary
});

// USAGE 
axios.get('/api/chat/chats', {
  params: {
    email: email
  }
})
.then(response => {
  console.log('Chat list:', response.data);
  // Handle the chat list if necessary
})
.catch(error => {
  console.error('Error:', error.response.data);
  // Handle error if necessary
});
```


```ts
GET      /api/chat/chats // get all chat , this must with parameter email 
// CORE
export const getChatList = async (req: Request, res: Response) => {
  try {
    // Extract email from query parameters
    const { email } = req.query;
    
    // Check if email is provided
    if (!email) throw new Error("Invalid data");
    
    // Query Firestore for PDFs associated with the specified email
    const pdfsRef = firestore.collection("pdfs");
    const pdfsSnapshot = await pdfsRef.where("email_id", "==", email).get();
    
    // Extract PDF IDs from the PDFs snapshot
    let pdfIds = pdfsSnapshot.docs.map((doc) => doc.id);
    
    // Initialize an array to store the results
    let results: any[] = [];
    
    // Split PDF IDs into chunks of 10
    let chunks = [];
    for (let i = 0; i < pdfIds.length; i += 10) {
      chunks.push(pdfIds.slice(i, i + 10));
    }
    
    // Iterate over chunks and query Firestore for chats
    for (let chunk of chunks) {
      const chatsRef = firestore.collection("chats");
      const chatSnapshot = await chatsRef.where("file_id", "in", chunk).get();
      
      // Iterate over chat documents and extract relevant data
      chatSnapshot.forEach((chatDoc) => {
        const chatData = chatDoc.data();
        let result = {
          docId: chatData.file_id,
          created_at: chatData.created_at,
          docName: pdfsSnapshot.docs
            .find((doc) => doc.id === chatData.file_id)!
            .data().pdf_filename,
          chatId: chatDoc.id,
          title: chatData.conversation
            ? chatData.conversation[1].title || ""
            : "",
        };
        results.push(result);
      });
    }
    // Return the list of chat data
    return res.status(200).json(results);
  } catch (error) {
    // Handle errors and send an error response
    console.error(error);
    return res.status(500).send("Failed processing this task");
  }
};

```
```ts
POST     /api/chat/speech-to-text // convert speech to text for recorded voice message 
// CORE
export const speechToTextHandler = async (req: Request, res: Response) => {
  try {
    // Extract vocal data from the request body
    const [vocal] = [req.body.vocal];

    // Use replicate.run method to convert speech to text
    const output: any = await replicate.run(
      "openai/whisper:4d50797290df275329f202e48c76360b3f22b08d28c196cbc54600319435f8d2", // Model ID
      {
        input: {
          audio: vocal,                   // Input audio data
          model: "large-v3",             // Model version
          translate: false,               // Disable translation
          temperature: 0,                // Temperature parameter for sampling
          transcription: "plain text",    // Output format as plain text
          suppress_tokens: "-1",          // Suppress tokens
          logprob_threshold: -1,         // Log probability threshold
          no_speech_threshold: 0.6,      // No speech threshold
          condition_on_previous_text: true, // Condition on previous text
          compression_ratio_threshold: 2.4, // Compression ratio threshold
          temperature_increment_on_fallback: 0.2, // Temperature increment on fallback
        },
      }
    );

    // Return the transcription in the response
    return res.status(200).json({ transcription: output.transcription });
  } catch (error) {
    // Handle errors and send an error response
    return res.status(500).json({
      message: "Error occurred",
    });
  }
};

// USAGE
axios.post('/api/chat/speech-to-text', {
  vocal: vocalData
})
.then(response => {
  console.log('Transcription:', response.data.transcription);
  // Handle the transcription if necessary
})
.catch(error => {
  console.error('Error:', error.response.data);
  // Handle error if necessary
});

```
```ts
DELETE   /api/chat/ // delete a document and its chats 
// CORE
export const deleteDocument = async (req: Request, res: Response) => {
  try {
    // Extract docId from query parameters
    const { docId } = req.query;
    
    // Get reference to the document in Firestore
    const docRef = firestore.collection("pdfs").doc(docId as string);
    
    // Query Firestore for chats associated with the document
    let _query = firestore.collection("chats").where("file_id", "==", docId);
    let _snapshot = await _query.get();
    
    // Iterate over chat documents and delete them
    for (const _doc of _snapshot.docs) {
      try {
        await _doc.ref.delete();
        console.log(`Deleted chat document ${_doc.id}`);
      } catch (error) {
        console.log(`Error deleting chat document ${_doc.id}:`, error);
      }
    }
    
    // Delete the main document
    await docRef.delete();
    
    // Return success message
    return res.status(200).send("Document and associated chats deleted successfully");
  } catch (error) {
    // Handle errors and send an error response
    console.error("Error occurred:", error);
    return res.status(500).send("Failed processing this task");
  }
};

// USAGE
axios.delete(`/api/chat/delete-document?docId=${docId}`)
.then(response => {
  console.log('Document and associated chats deleted successfully');
  // Handle success if necessary
})
.catch(error => {
  console.error('Error:', error.response.data);
  // Handle error if necessary
});
```






## Firebase  (/api/firebase)
This is a dynamic endpoint that can handle any entry data 
```ts
POST     /api/firebase/insert-document // insert any data into given collection 
// Example data to be inserted
const data = {
  name: "John Doe",
  age: 30,
  email: "john@example.com"
};

// Endpoint URL
const endpoint = '/api/firebase/insert-document';

// Make a POST request to insert data
axios.post(endpoint, {
  collectionName: 'users', // Specify the collection name
  data: data               // Provide the data to be inserted
})
.then(response => {
  console.log('Document inserted successfully with ID:', response.data.id);
  // Handle success if necessary
})
.catch(error => {
  console.error('Error:', error.response.data);
  // Handle error if necessary
});
```
```ts
POST     /api/firebase/find-documents // retrieve data from given  collection with given conditions 
const axios = require('axios');

// Example conditions for querying
const conditions = [
  { field: 'age', operator: '>', value: 25 },  // Find documents where 'age' is greater than 25
  { field: 'country', operator: '==', value: 'USA' } // Find documents where 'country' is 'USA'
];

// Endpoint URL
const endpoint = '/api/firebase/find-documents';

// Make a POST request to find documents
axios.post(endpoint, {
  collectionName: 'users', // Specify the collection name
  conditions: conditions   // Provide the conditions for querying
})
.then(response => {
  console.log('Documents found:', response.data.results);
  // Handle the found documents if necessary
})
.catch(error => {
  console.error('Error:', error.response.data);
  // Handle error if necessary
});
```
```ts
POST     /api/firebase/update-document // update data from given collection 
// Example data to update
const dataToUpdate = {
  name: "Jane Doe",
  age: 35
};

// Endpoint URL
const endpoint = '/api/firebase/update-document';

// Example document ID to update
const docId = "your_doc_id_here";

// Make a POST request to update the document
axios.post(endpoint, {
  collectionName: 'users',   // Specify the collection name
  docId: docId,              // Specify the document ID to update
  data: dataToUpdate         // Provide the updated data
})
.then(response => {
  console.log('Document updated successfully');
  // Handle success if necessary
})
.catch(error => {
  console.error('Error:', error.response.data);
  // Handle error if necessary
});

```

```ts
POST     /api/firebase/find-document // find document by its id from given collection 
axios.post('/api/firebase/find-document', {
  collectionName: collectionName, // Specify the collection name
  docId: documentId              // Specify the document ID to find
})
.then(response => {
  console.log('Document found:', response.data.data);
  // Handle the found document if necessary
})
.catch(error => {
  console.error('Error:', error.response.data);
  // Handle error if necessary
});
```
```ts
POST     /api/firebase/delete-document // delette document by its id from given collection 
axios.post('/api/firebase/delete-document', {
  collectionName: collectionName, // Specify the collection name
  docId: documentId              // Specify the document ID to delete
})
.then(response => {
  console.log('Document deleted successfully');
  // Handle success if necessary
})
.catch(error => {
  console.error('Error:', error.response.data);
  // Handle error if necessary
});

```
```ts
POST     /api/firebase/delete-user // delete user from firebase auth 
axios.post('/api/firebase/delete-user', {
  uid: uid,     // Specify the UID of the user to delete
  email: email // Specify the email of the user to delete
})
.then(response => {
  console.log('User deleted successfully');
  // Handle success if necessary
})
.catch(error => {
  console.error('Error:', error.response.data);
  // Handle error if necessary
});

```
