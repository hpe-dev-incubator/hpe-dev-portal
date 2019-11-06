---
title: Use Grommet Face Detection and Microsoft Azure Cognitive Services to identify people in pictures
date: 2019-11-01T02:40:45.562Z
author: Pramod Sareddy 
tags: ["grommet"]
path: use-grommet-face-detection-and-microsoft-azure-cognitive-services-to-ide
---
![picture1](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/10/picture1-1572576650255.png)

In this article, I am going to show you how to perform face detection and recognition using the Grommet Face Detection application and the Microsoft Azure Face API, which is available through Azure Cognitive Services. This is a fun application we have used at different events to showcase the many uses of Grommet. While fun, it also has practical applications in healthcare, banking, retail, and security industries.

The front-end face detection application is used to fetch the image from the network camera, send it to Azure Face API, and display the facial recognition response. The Azure Cognitive Services Face API is used to recognize human faces in a picture. When you send a picture from the face detection application to the Azure Face API,  it detects human faces in the image and tells you that, within a certain position, there is a face. It will even identify certain face-related attributes such as gender, estimated age, emotion, head position, facial hair, eyeglasses, and a lot more! 

## Why use the Grommet Face Detection application?

I built this face detection/recognition application to show how quickly you can build a responsive web app using HPE Open Source UI development and a design framework called Grommet that interacts with Microsoft Azure Cognitive Services. The face-detection scenario leverages the Azure Face API in conjunction with Node.js to extract and recognize the facial expressions and emotions of various people. 

You can use this same methodology to build your own personalized application. For instance, you can design it so that when you walk into the room, the computer recognizes you and automatically sets the lights and music per your preference. There are other use cases as well. Imagine building a natural language interactive robot. You could design it so that it looks at someone’s face and recognizes them when they walk into a store. It could determine that person’s emotions by the way he or she looks. If angry, the robot knows and reacts accordingly. If happy, perhaps it might try to sell that person more items. To show you how this all works, instead of building a complex robot, I built a simple Face Detection Web Application using HPE Grommet that interacts with Microsoft Cognitive Services. You can learn more about Grommet by reading  a previous HPE DEV blog - [Grommet – the Glue that Binds Development and Design.](https://developer.hpe.com/blog/grommet-the-glue-that-binds-development-and-design)

## What exactly are Microsoft Cognitive Services?

Microsoft Cognitive Services allow applications to hear, see, and understand the world just like you would. If you were to pause for a second and think of all the people you know, your family, your friends, your boss and so on, what would come to mind? Are you thinking of their faces? And emotions?

Microsoft Cognitive Services provides you the power to recognize all of that in your applications. And it’s so simple to use! All you need to do is make a REST API call using your preferred programming language and you will enable your application to do amazing things. Microsoft Cognitive Services is comprised of Decision, Vision, Speech, Knowledge, Search, and Language APIs. Within each of these buckets, there are numerous capabilities. In this post, I’m going to focus on how I used the Azure Face API, which is part of the Vision service, to detect, recognize, and analyze the human faces in images.

## Recognizing  and identifying a human face

There are two aspects of facial recognition; the first is recognizing that there is a face within a picture and the second is identifying whose face it is. Cognitive Services allow you to easily recognize faces in a picture. You send a picture, and it tells you that at certain rectangle position, there is a face. It will even tell you things like about the face, like age, gender, expression, whether eyeglasses are worn, and a lot more! 

To identify the face in the picture using the Azure Face API, you first need to build a library (the dataset of your AI machine learning model) of people with associated faces. To do this, you first need to create a Person group. To that Person group, you add numerous images of people.  For example, I could upload pictures of Hewlett Packard Enterprise (HPE) CEO Antonio Neri to the library, along with other faces. I then assign Antonio’s name to (one or more) pictures that have him in it. Once you have created your database of people, you then train the model. Training the model is an important step for your AI model to make more accurate identifications. After that, input a picture that the program has never seen before. This would be a picture of a person who is already in the library. It could also be a picture with more than one person, where one of the people in the picture is part of our library. Based on matching it against those already in the library, the face detection application will "identify" the person, as in "I think this is Antonio Neri, and my confidence is 99%."

I must mention that given the number of steps required, I can’t show every line of code in this article. However, you can download the source code and set it up. The instructions can be found in the __Set up the code__ section of this article.

## Set up the Face API in Azure

Like many Cognitive Services APIs, to use the Face API, you need to provision it for use in the Azure Portal. Log in to the Azure portal, click on the __Create a resource__ link, and choose the option that allows you to create a new instance of the Face API. You will be provided with a Cognitive service API endpoint and subscription keys used for every call to your deployed instance of the Azure Cognitive Services Face API as shown below.


![picture2](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/10/picture2-1572576983408.png)



![picture3](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/10/picture3-1572577002107.png)

The application will ask you to define certain parameters. Among other things, you’ll need to specify a pricing tier. For this example, the F0 subscription-level free tier is fine. Once you’ve created a resource, grab the endpoint address and the two keys. I chose to put mine into an environment file called .env inside the face detection source code folder.

## Authenticate to the Face API

Calls to the Face API are simple REST calls. They can be GET/POST/DELETE or any other such common HTTP verb wrapped in a Face API call with your preferred programming language, whether it’s C#, Node.js, cURL, Go, Java, Javascript, Python, PHP, or Ruby. All the API calls must be authenticated. To authenticate the call, you need to pass in a specific HTTP header called Ocp-Apim-Subscription-Key, and then pass in either of the two keys you previously saved. The reason Microsoft Azure provides two keys is for redundancy. If one key gets compromised, you can choose to use the other while the first one is regenerated.

I used the fetch method inside my face detection application to make REST API calls. The instructions to download the source code based on Node.js can be found in the __Set up the code__ section of this article.

## Face detection

Detection, as the name suggests, detects human faces in an image. But it can do so much more than that. When you call up the Detect method, you have a choice of requesting multiple details of the recognized faces. Of course, the more details you request, the longer the request takes. In your inputs to the detect method, you can pass in various optional request parameters like FaceID, FaceLandmarks, and FaceAtrributes ( smile, emotion, age, gender, and so on).


```javascript

// adding face detect attributes
const addImageParams =
  'returnFaceId=true&returnFaceLandmarks=false&returnFaceAttributes=age,gender,smile,facialHair,glasses,emotion,hair,makeup,accessories,headPose';

// URI for face Detection
const detectUri = `${baseUrl}/detect?${addImageParams}`;
// API call to Detect human faces in an image, return face rectangles, and optionally with faceIds,
// landmarks, and attributes
async function fetchFaceEntries(imageData) {
  const blob = await dataURLtoBlob(imageData);
  const faceDetect = await fetch(detectUri, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/octet-stream',
      'Ocp-Apim-Subscription-Key': subscriptionKey,
    },
    body: blob,
  }).catch(err => {
    console.log('err', err);
  });

return faceDetect;
}

```

## Lights, camera, action!

Now that you have the basics, let me show you the steps required to work with the Face Detection application.

## Step 1: Create a Person Group

Creating a Person Group is a matter of issuing a PUT request to your Face API endpoint URL that looks like this:

`https://{endpoint}/face/v1.0/persongroups/{personGroupId}`

The personGroupId is simply a user-provided string. Along with such a request, you need to include a request body with the following JSON object:

{ ‘name’: personGroupId}



```javascript

// URI to create a person group mentioned in .env file
const personGroupUri = `${baseUrl}/persongroups/${personGroupName}?`;
// create a person group
async function createPersonGroup() {
  const personGroup = await fetch(personGroupUri, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': subscriptionKey,
    },
    body: JSON.stringify({
      name: personGroupName,
    }),
  }).catch(err => {
    console.log('err', err);
  });

const pGroup = await personGroup.json();
  return pGroup;
}

```
## Step 2: Create a Person

Once you’ve created a Person Group, the next step is to add people into that Person Group. This is a simple POST request to your Face API endpoint:

`https://{endpoint}/face/v1.0/persongroups/{personGroupId}/persons`

Note that the request URL includes the personGroupId. This is how you tell the Face API which Person Group a Person belongs in. Also, you need to specify the name of the person you’re adding as a JSON object that looks like this:

```javascript
	{ "name": personName}
```
The name is the display name of the target person. The REST API call returns the personID created. You will need the personID to associate a face to the person in the next step.


```javascript

// URI to create a new person in a specified person group
const personUri = `${baseUrl}/persongroups/${personGroupName}/persons`;
// create a new person in a specified person group
async function createPerson(personName) {
  const person = await fetch(personUri, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': subscriptionKey,
    },
    body: JSON.stringify({
      name: personName,
    }),
  }).catch(err => {
    console.log('err', err);
  });
  const personResponse = await person.json();
  return personResponse;
}

```

## Step 3: Add a Person Face

Adding a Person Face (an image that contains the face of the person) is another REST call. This time it’s a POST request to the following URL:

`https://{endpoint}/face/v1.0/persongroups/{personGroupId}/persons/{personId}/persistedFaces` 

As you can see from the URL, you’re posting to the /persistedFaces URL for the given person in the given person group. The next question is: How do you specify the actual file contents? There are two ways:

1. Either you can specify the content-type header to be application/json, and send the following JSON object in the body of the POST request:
	{ url: ‘url_to_the_image’}
2.	Or you can specify the content-type header to be application/octet-stream and send the contents of the image.


```javascript

// API call to add the current face image to a specific person
async function addImage(imageSrc, personId) {
  const addImageUrl = `${baseUrl}/persongroups/${personGroupName}/persons/${personId}/persistedFaces?`;
  const buff = await dataUriToBuffer(imageSrc);
  await fetch(`${addImageUrl}${addImageParams}`, {
    method: 'POST',
    body: buff,
    headers: {
      'Content-Type': 'application/octet-stream',
      'Ocp-Apim-Subscription-Key': subscriptionKey,
    },
    credentials: 'same-origin',
  });
}

```

## Step 4: Train the Model

Once you’ve created the Person Group, added Persons, and added Faces to the Persons, you need to train the person group before you can start asking Face API to identify people. Training the Person Group is yet another REST call. You simply issue a POST request to the following URL specifying the personGroupId of the person group you want to train. The subscription key must be passed in the request header (not shown here) as for any other Face API call:

`https://{endpoint}/face/v1.0/persongroups/{personGroupId}/train` 

The training task is an asynchronous task. Training time depends on the number of person entries, and their faces in a person group. It could be several seconds to minutes. To check training status, issue another GET REST call to the following URL:

`https://{endpoint}/face/v1.0/persongroups/{personGroupId}/training`

Congratulations! With your model complete, now you can send an input picture and have the Face API identify the person.

In my example, I called the appropriate method to create one for a person named “Pramod” in the Person Group called “hpe”, then added persons face to Person Group and trained the model.

## Step 5: Detect or recognize the person

Remember, the way recognition works is that you must first detect there is a face in the picture. Here’s an example. You have to send the picture to the Face API and have the Face API detect a face in the picture. In doing so, the Face API detect method returns an identifier (the FaceID) of the detected face. This identifier is temporary and it’s only good for 48 hours. However, Person IDs are permanent. 

You send the picture to Face API by issuing a POST request to the following URL:

`https://{endpoint}/face/v1.0/detect[?returnFaceId][&returnFaceLandmarks][&returnFaceAttributes][&recognitionModel][&returnRecognitionModel][&detectionModel]`

Also, you must include the following body:


```javascript
{
    "url": http://example.com/1.jpg //URL of input image
}

```

```javascript
// adding face detect attributes
const addImageParams =
  'returnFaceId=true&returnFaceLandmarks=false&returnFaceAttributes=age,gender,smile,facialHair,glasses,emotion,hair,makeup,accessories,headPose';

// URI for face Detection
const detectUri = `${baseUrl}/detect?${addImageParams}`;
// API call to Detect human faces in an image, return face rectangles, and optionally with faceIds,
// landmarks, and attributes
async function fetchFaceEntries(imageData) {
  const blob = await dataURLtoBlob(imageData);
  const faceDetect = await fetch(detectUri, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/octet-stream',
      'Ocp-Apim-Subscription-Key': subscriptionKey,
    },
    body: blob,
  }).catch(err => {
    console.log('err', err);
  });
  return faceDetect;
}
```
## Step 6: Identify the person

Once you have the Face ID, you can identify the person from the person group with personGroupId. You do so by issuing a POST request to the following URL:

`https://{endpoint}/face/v1.0/identify` 

Also, you must include the following body:


```javascript
{
 'personGroupId': personGroupId,
 "faceIds": [faceId],
 "maxNumOfCandidatesReturned": 1,
 "confidenceThreshold": 0.5
}
```

Note that, in the body, you specify the number of candidates you’d like to have in the result set and the minimum confidence threshold of recognition that should be met. Also, you pass in the Face ID.


```javascript
// URI for face Identify
const identifyUril = `${baseUrl}/identify?`;
// Call this after detecting faces, with face IDs,
// to identify the faces from the people group
async function identifyFaceFromGroup(faceIdsArray, personGroupId) {
  const res = await fetch(identifyUril, {
    method: 'POST',
    body: JSON.stringify({
      faceIds: faceIdsArray,
      personGroupId,
    }),
    headers: {
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': subscriptionKey,
    },
    credentials: 'same-origin',
  }).catch(err => {
    console.log('err', err);
  });
  return res;
}

```

## The Face Detection system

In my trials using the Face Detection Application, I implemented the setup below. It consists of an EdgeLine server on which I created a Kubernetes cluster and deployed the front-end Face Detection application. It is backed by a camera application used to fetch the images from the network cameras and send it to the Azure Face API for facial recognition.

__Note:__ You can clone the repo and run it on your laptop with NodeJS. Also, you can send any Image URL as input to the Azure Face API. I chose to get the images from network cameras and deployed the application on an EdgeLine server.


![picture6](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/10/picture6-1572577698549.png)

In this example, users log in to the face detection application running on the EL300 Kubernetes cluster. As soon as the user logs in, the face detection app fetches the current image from the network camera and loads the screen below.

![picture7](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/10/picture7-1572577723410.png)

Once you click on the Detect Face button, the image will be sent to Azure Face API and you will get the below result with rectangles covering the faces along with data on facial attributes.

![picture9](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/10/picture9-1572577749047.png)

Since I added only one image with the name “Pramod” to the face detection library, Azure Face API was able to predict the name with 69% confidence and the rest of the faces came up as unknown with other facial attributes like gender, age, hair, emotions and so on.

## Set up the code

As you can see, there are a lot of steps, and I wasn’t able to explain every single detail in this article. However, you can get the full source code for this and set it up on your computer easily. Just follow these instructions:

1. Ensure that you have Node.js version 8x or newer installed, as well as NPM 6 or later.

2. Clone this GitHub repository https://github.com/reddypramod85/facedetection

3. Provision an instance of the Face API in Azure, as explained earlier in this article.

4. Get the endpoint and the two subscription keys for the provisioned instance of Face API.

5. Create a .env file and place one of the keys, PersonGroupName (EX: “hpe”), and the image URL ( EX: `"http://localhost:5000/images/oscongroup.png"`) in the .env file as shown below:

* REACT_APP_SUBSCRIPTION_KEY= “Azure Face API subscription key”

* REACT_APP_PERSON_GROUP_NAME=hpe

 * REACT_APP_CAMERA_IMAGE_URL=`"http://localhost:5000/images/oscongroup.png"`

6.	Run npm install to install the Grommet face detection application.

## Next steps

There are many use cases where face detection is helpful. It can help in retail environments. For instance, imagine that you walk into a store, and a camera instantly recognizes you and sends you discount codes on your phone that you must use in the next 20 minutes. The possibilities are really endless, and this is only one of the many capabilities of Microsoft Cognitive Services. I hope to cover some of these other features in future articles. Keep a lookout on the [HPE DEV blog site](https://developer.hpe.com/blog) for more articles on this subject.
