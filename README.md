# instructions on building keycloak with helm

NOTE: Open ID Connect (OIDC) is an authentication protocol that is an extension of OAuth 2.0. While OAuth 2.0 is only a framework for building authorization protocols and is mainly incomplete, OIDC is a full-fledged authentication and authorization protocol. OIDC also makes heavy use of the Json Web Token (JWT) set of standards. These standards define an identity token JSON format and ways to digitally sign and encrypt that data in a compact and web-friendly way.

There is really two types of use cases when using OIDC. The first is an application that asks the Keycloak server to authenticate a user for them. After a successful login, the application will receive an identity token and an access token. The identity token contains information about the user such as username, email, and other profile information. The access token is digitally signed by the realm and contains access information (like user role mappings) that the application can use to determine what resources the user is allowed to access on the application.

The second type of use cases is that of a client that wants to gain access to remote services. In this case, the client asks Keycloak to obtain an access token it can use to invoke on other remote services on behalf of the user. Keycloak authenticates the user then asks the user for consent to grant access to the client requesting it. The client then receives the access token. This access token is digitally signed by the realm. The client can make REST invocations on remote services using this access token. The REST service extracts the access token, verifies the signature of the token, then decides based on access information within the token whether or not to process the request.
https://www.keycloak.org/docs/3.2/securing_apps/topics/overview/supported-protocols.html

## For the Node_js app I used this setup.
### setup cluster keycloak cluster to use OIDC
* spin up minikube
  `minikube start`
* install helm
  `brew install kubernetes-helm`
* with minikube running, install Tiller
  `helm init --history-max 200`
* validate helm/tiller
  `helm version`

### install keycloak
* install repo for keycloak chart
  `helm repo add codecentric https://codecentric.github.io/helm-charts`
* install keycloak with postgres using helm/keycloak/values.yaml
  `helm install --name keycloak -f values.yaml codecentric/keycloak`
* make sure keycloak/keycloak-postgress pods are running
  `kubectl get pods --all-namespaces `
* configure
  `export POD_NAME=$(kubectl get pods --namespace default -l app=keycloak,release=keycloak -o jsonpath="{.items[0].metadata.name}")`
* port forward
  `kubectl port-forward --namespace default $POD_NAME 8080`

### login and create client
* login to site
  `http://127.0.0.1:8080`
* create client at client >> new client using
   `openid-connect`
* on the new client, click on installation and select OIDC JSON. Download it. You will use this to configure your client app.

### Test
* copy the OIDC JSON file into samples/node.js/

NOTE: add `"bearer-only": true` to the json file for api calls not in a browser.

* npm install in sample/node.js app
* npm start
* test non-authenticted url
  `curl -X GET http://localhost:3000/service/public`
* test authenticted url
  `curl -X GET http://localhost:3000/service/secured`

NOTE: you should see `Access denied`

* authenticate a user and pass JWT token using OIDC
  `curl -k  -X POST http://127.0.0.1:8080/auth/realms/master/protocol/openid-connect/token  -d grant_type=password  -d client_id=test -d username=keycloak -d password=keycloak | jq`

NOTE: You get this URL by going to the main keycloak authenticated page and clicking on *OpenID Endpoint Configuration*

* validate you see something like this: https://www.evernote.com/l/AGURW9USio5BO5CzfRsohyDs0lbzwFv9czQ
* pass the bearer token (JWT) with the request as a header. The bearer token is the access token.

NOTE: to do this I just exported a variable and set the access token to it
  `export access_token=$(\
    curl -X POST http://127.0.0.1:8080/auth/realms/master/protocol/openid-connect/token \
    -H 'content-type: application/x-www-form-urlencoded' \
    -d 'username=keycloak&password=keycloak&grant_type=password&client_id=test' | jq --raw-output '.access_token' )`

* make a secured request:
  ` curl -X GET http://localhost:3000/service/secured -H "Authorization: Bearer "$access_token `
Note: You should see {"message":"I am an authenticated response."}


## For the React app
I pretty much followed this tutorial: 
https://scalac.io/user-authentication-keycloak-1

There were some minor changed to the promise callbacks.
* Spin up docker:
`docker run -p 8081:8080 -e KEYCLOAK_USER=admin -e KEYCLOAK_PASSWORD=admin -e DB_VENDOR=H2 jboss/keycloak`
* Create a new realm `demo`
* Create a new user `wes` & setup credentials
* download json and insert into the react app following tutorial above
