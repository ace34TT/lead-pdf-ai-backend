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

GET      /api/chat/documents // get all documents , this must with parameter email 
GET      /api/chat/chats // get all chat , this must with parameter email 
POST     /api/chat/speech-to-text // convert speech to text for recorded voice message 
DELETE   /api/chat/ // delete a document and its chats 
```






## Firebase  (/api/firebase)
This is a dynamic endpoint that can handle any entry data 
```ts
POST     /api/firebase/insert-document // insert any data into given collection 
POST     /api/firebase/find-documents // retrieve data from given  collection with given conditions 
POST     /api/firebase/update-document // update data from given collection 
POST     /api/firebase/find-document // find document by its id from given collection 
POST     /api/firebase/delete-document // delette document by its id from given collection 
POST     /api/firebase/delete-user // delete user from firebase auth 
POST     /api/firebase/sign-in-with-mail // sign in user from firebase auth 
```
