# YouTube Transcript

## Getting Started

### Installation

- Clone the repository or download and unpack the zip file.

- Open terminal and locate the folder and run the following commands

  ```
  Cd youtube_transcript
  npm install
  ```

- After installing the node packages now its time for installing the requirements for the the python server
- In the same terminal, follow the below steps.

  ```
  cd backend
  pip install requirements.txt
  ```

---

## Running the application

### Starting react app in terminal.

- If you are in the backend folder move one folder back to youtube_transcript and type the command

  ```
  cd..
  npm start
  ```

### Starting the Python Server

- Navigate to backenf folder in the terminal and run the command

  ```
  cd backend
  Python main.py
  ```

---

## How to use

- Copy and paste any youtube video link in the top input area and click 'Get Video'.
- This will fetch the video and create a transcript file.
- Now clicking on the bookmark button will show the transcript of the video for that specific time frame.
