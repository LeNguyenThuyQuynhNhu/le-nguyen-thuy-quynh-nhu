# Software Requirements Specification (API service)

# Module Name: Scoreboard Management

## 1 Document Purpose

This module is responsible for managing the scoreboard functionality on the website, ensuring live updates of the top 10 user scores, and handling score updates securely.

## 2 Intended Audience

Backend Developer, Frontend Developer, System Architects

## 3 Functional Requirements

- Scoreboard Display: The system shall display the top 10 user scores on the scoreboard interface of the website. The scoreboard interface shall include the user's name or identifier and their corresponding score.
- Real-time Updates:
  The system shall update the scoreboard in real-time to reflect any changes in user scores.
  Score updates shall be automatically reflected on the scoreboard interface without requiring manual refresh by the user.
- Score Update Mechanism:
  Upon completion of a user action, the system shall trigger an API call to the application server to update the user's score.
  The API call for score update shall include parameters such as the user's identifier and the score increment.
- The system shall implement authentication mechanisms to verify the identity of users initiating score updates.
  Only authenticated users with the necessary permissions shall be authorized to trigger score updates.
  Authorization checks shall be performed to ensure that only authorized users can access and update scores, thereby preventing unauthorized score increases.
  The system shall implement rate limiting to prevent abuse and unauthorized attempts to update scores.
- Error Handling: The system shall handle errors and provide informative error messages to users in case of invalid requests, authentication failures, or server errors during score updates.
- Security: Authorization checks shall be performed to ensure that only authorized users can access and update scores, thereby preventing unauthorized score increases.
  The system shall implement rate limiting to prevent abuse and unauthorized attempts to update scores.
- Testing and Quality Assurance: ensure that it meets the specified requirements and performs reliably under various conditions. Testing to validate the functionality, performance, and security of the scoreboard feature.

## The flow of execution:


                                        +---------------------+
                                        | User Logs In        |
                                        +----------+----------+
                                                |
                                                v
                                        +----------+----------+
                                        |   Get Top User      |
                                        |     Scores          |
                                        +----------+----------+
                                                |
                                                v
                                        +---------------------+
                                        | User Action         |
                                        +----------+----------+
                                                |
                                                v
                                        +----------+----------+
                                        |   Update User's     |
                                        |       Score         |
                                        +----------+----------+
                                                |
                                                v
                                        +----------+----------+
                                        |  Authorization &    |
                                        |    Validation       |
                                        +----------+----------+
                                                |
                                    Authorization & Validation Decision
                                                |
                                    +-------------+-------------------+
                                    |                                 |
                                    |                                 |
                                Allowed                             Error
                                    |                                 |
                                    v                                 v
                            +----------+----------+              +----------+----------+       
                            |  Dispatch API Call  |              |      Response       |
                            |     to Update       |              |        Error        |
                            |       Score         |              |(ex: 403 or 401, ..) |   
                            +----------+----------+              +----------+----------+
                                       |
                                       v
                            +----------+----------+
                            |    Update Score     |
                            |    on Backend       |
                            |     Database        |
                            +----------+----------+
                                       |
                                Update Result
                                       v
                        +-------------+-------------------+
                        |                                 |
                        |                                 |
                     Done                               Error
                        |                                 |
                        v                                 v   
            +----------+----------+            +----------+----------+  
            |   WebSocket Server  |            |      Response       |
            |   Send New Score    |            |        Error        |
            |   to Client         |            |  (400 Bad Request)  |
            +----------+----------+            +----------+----------+                       



## Endpoints

### 1. Authentication Endpoint:`/auth/login`

- Method: POST

- Description: Authenticate users by verifying their credentials (e.g., username and password), use JWT (JSON Web Token)
- Request Body:

  username (required): The username of the user trying to log in.

  password (required): The password associated with the user's account.

- Response Status:
  200 OK if authentication is successful
  401 Unauthorized if authentication fails

- Response Body: JSON object containing authentication token if successful. Use JSON Web Tokens to gen Token

### 2. **Endpoint get top 10**: `/scores/top`

- Method: GET

- Description: Retrieve the top 10 user scores for display on the scoreboard interface.

- Parameters: None

- Response: Status: 200 OK

- Response Body: JSON array containing the top 10 user scores with user ID and score fields.

### 3. **Endpoint update the score**: `/scores/update`

- Method: POST
- Description: Trigger a score update for a specific user after completing an action front end will call this api.
- Parameters:

  Authorization: Bearer token obtained from the authentication endpoint.

  User ID (required): Identifier of the user whose score needs to be updated.

  Action Id (required): Identifier of the action which the user completing. We will mapping with action_score table on database to get Score Increment by action

- Response Body: JSON object containing user ID and score increment fields.

- Response Status:

  200 OK if the update is successful

  401 Unauthorized if the user is not authenticated or authorized

  400 Bad Request if the request is invalid

  403 forbidden if user don't have permission update or **user update to another user** (with Bearer token, Check if the user from the token is not the same as user_id)

  500 Internal Server Error if there is a server-side issue.

## Use WebSocket for live update of the score board.

Establish WebSocket connections between the client (browser) and the backend server to enable bidirectional, real-time communication.

**Establish WebSocket Connection:** Clients establish WebSocket connections to the backend server.

Whenever a score update occurs, the server sends a WebSocket message to all connected clients, notifying them of the updated score. Upon receiving a score update message from the server, clients update the scoreboard interface to reflect the updated scores.

Example code:

```
// Create a WebSocket server
const wss = new WebSocket.Server({ port: PORT });

// Function to broadcast message to all connected clients
function broadcast(message: string): void {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// Event listener for WebSocket connections
wss.on('connection', function connection(ws: WebSocket) {
  console.log('New client connected');

  // Event listener for WebSocket connection close
  ws.on('close', function close() {
    console.log('Client disconnected');
  });
});
```

Update the score and broadcast the updated score to clients when **Endpoint update the score called** `/scores/update`

```
// Function to update the score and broadcast the updated score to clients
function updateScoreAndBroadcast(scoreData: any): void {
  // Update the score (logic to update the score goes here)

  // Convert the updated score data to JSON string
  const scoreUpdateMessage = JSON.stringify(scoreData);

  // Broadcast the updated score to all connected clients
  broadcast(scoreUpdateMessage);
}

app.post('/scores/update', (req, res) => {
  // Logic to update the score ...

  // Update the score and broadcast the updated score to clients
  updateScoreAndBroadcast(scoreData);

  // Send a success response
  ...
});
```

On client

```
const ws = new WebSocket('ws://localhost:8080');

// Event listener for WebSocket open
ws.onopen = function() {
  console.log('Connected to WebSocket server');
};

// Event listener for incoming messages from the server
ws.onmessage = function(event) {
  const message = event.data;
  console.log('Received message:', message);

  // Update the scoreboard UI with the received message
  ...
};
```

# To prevent malicious users from increasing scores without authorization

## Authentication

- Use user and password to login

- Use JSON Web Tokens

- Define Permissions to control who can modify scores. Check user Permission before update.

## Implement rate limiting

### **Check on code:**

`npm install express-rate-limit`

Create a rate limiter maximum of 100 requests per minute (max: 100).

```
// Apply rate limiting middleware
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // maximum 100 requests per windowMs
  message: 'Too many requests, please try again later.',
});

// Apply rate limiting to specific routes or all routes
```

Only one request is allowed per IP address within a 3-second.

```
const limiter = rateLimit({
  windowMs: 3000, // 3 seconds
  max: 1, // Maximum 1 request per windowMs
  keyGenerator: function(req) {
    return req.ip; // Use the IP address of the requester as the key
  },
  message: 'Too many requests, please try again later.',
});
```

With this setup, if a user exceeds the maximum number of requests allowed within the specified window, they will receive a 429 Too Many Requests status code along with the message specified in the message option.

### **Rate limiting on the proxy**

Follow:

                    +---------------------+
                    | Client Request      |
                    +----------+----------+
                               |
                               v
                    +----------+----------+
                    | Rate Limiting Logic|
                    +----------+----------+
                               |
                     Rate Limiting Decision
                               |
                 +-------------+-------------+
                 |                         |
          Request Allowed            Request Rate Limited
                 |                         |
                 v                         v
         +-------+-------+        +--------+--------+
         |               |        |                 |
         |  Process      |        |  Rate Limiting  |
         |  Request      |        |  Response       |
         |               |        |  (e.g., 429)    |
         +---------------+        +-----------------+

**Use nginx, set up max request per second**

Define a limit zone named "proxy_limit" with a maximum of 10 requests per second

```
limit_req_zone $binary_remote_addr zone=proxy_limit:10m rate=10r/s;
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        # Apply rate limiting using the "proxy_limit" zone defined above
        limit_req zone=proxy_limit burst=5;

        # Proxy pass the requests to your backend server
        proxy_pass http://backend_server;

        # Other proxy settings...
    }
}
```

Use the limit_req directive to apply rate limiting using the "proxy_limit" zone. The burst parameter allows for a burst of up to 5 requests beyond the defined rate limit before requests are delayed or rejected.

**Use nginx, redis check request**

Add data to Redis key: request_times_by_user

```
// Function to update Redis with request time for a user IP address
function updateRedis(userIp) {
    const currentTime = Date.now();
    client.zadd('request_times_by_user:' + userIp, currentTime, currentTime);
}

// Example: Call updateRedis function with user IP address
//get userIP from Header("X-Real-Ip") or Header("X-Forwarded-For");
const userIp = '...'
updateRedis(userIp);
```

```
    server {
        listen 80;
        server_name yourdomain.com;

        location / {
            set $user_ip $remote_addr;

            # Query Redis for request times and enforce rate limiting
            redis2_query zcount request_times_by_user:$user_ip -inf +inf;
            limit_req_zone $binary_remote_addr zone=proxy_limit:10m rate=10r/s;
            limit_req_status 429;
            limit_req zone=proxy_limit burst=5;
            ...
        }
    }
```

In this way, can **save user_id call too much request**, there are intervention measures to **check, handel or remove with this user**.


