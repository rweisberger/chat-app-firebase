(function () {
  // TODO: replace this with your own firebase config object after creating app in your firebase console
  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyAS5lJopFrWuiZ2wKYaykXOB4qiv8HKtvA",
    authDomain: "fir-chat-1f3a4.firebaseapp.com",
    projectId: "fir-chat-1f3a4",
    storageBucket: "fir-chat-1f3a4.appspot.com",
    messagingSenderId: "442665197551",
    appId: "1:442665197551:web:1e463530d1eb40d075e01a"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  // handle on firebase db
  const db = firebase.database();

  process.env.API_KEY

  // get elements
  let email = document.getElementById('email');
  const password = document.getElementById('password');
  const login = document.getElementById('login');
  const signup = document.getElementById('signup');
  const logout = document.getElementById('logout');
  const message = document.getElementById('message');
  const write = document.getElementById('write');
  const read = document.getElementById('read');
  const status = document.getElementById('status');
  const userNameDisplay = document.getElementById('name-display'); // element that can show the current user's email
  const chat = document.getElementById('chat-box');
  let currentUserEmail = document.getElementById('name-display'); // variable to store the current user's email

  // write
  write.addEventListener('click', (e) => {
    const messages = db.ref('messages');
    const sender = db.ref('sender');


    // simple id - ok for example, do not use in production
    const id = new Date().getTime();

    // TODO: Add the value of currentUserEmail when writing to the database under the field name of "sender"
    messages
      .child(id)
      .set({ message: message.value, sender: currentUserEmail })
      .then(function () {
        console.log('Wrote to DB!');
      });
  });

  // read
  write.addEventListener('click', (e) => {
    handleRead();
    message.setAttribute('value','My default value')
  });

  // TODO: use this provided messagesRef to listen for updates and update the chat div on any update, not just when the 'Update Chat' button is clicked
  // const messagesRef = db.ref('messages');

  function handleRead() {
    // status.innerHTML = '';
    // message.innerHTML = '';
    const messages = db.ref('messages');

    // messages.once('value').then(function (dataSnapshot) {
    messages.on('value', function (dataSnapshot) {

      var data = dataSnapshot.val();
      if (data) {
        chat.innerHTML = '';
        var keys = Object.keys(data);

        keys.forEach(function (key) {
          // console.log(data[key]);
          chat.innerHTML +=
            (data[key]['sender'] || '') +
            '   :   ' +
            data[key].message +
            '<br><br>';        
        });
      }
      message.value = ''
    });
  }

  // TODO: in this function you should set the userNameDisplay.innerHTML to the passed in userEmail as well as updating the currentUserEmail variable to that same value
  function updateCurrentUser(userEmail) {
    userNameDisplay.innerHTML = "Welcome " + userEmail + "";
    currentUserEmail = userEmail;
    console.log(currentUserEmail)
  }

  // login
  login.addEventListener('click', (e) => {
    const auth = firebase.auth();
    const promise = auth.signInWithEmailAndPassword(
      email.value,
      password.value
    );
    promise.then((resp) => {
      console.log('User Login Response: ', resp);
      logout.style.display = 'inline';
      login.style.display = 'none';
      signup.style.display = 'none';
      write.style.display = 'inline';
      updateCurrentUser(resp.user.email);
    });
    promise.catch((e) => console.log(e.message));
    // email.value='';

  });

  // signup
  signup.addEventListener('click', (e) => {
    const auth = firebase.auth();
    const promise = auth.createUserWithEmailAndPassword(
      email.value,
      password.value
    );
    promise.then((resp) => {
      console.log('User Signup + Login Response: ', resp);
      logout.style.display = 'inline';
      login.style.display = 'none';
      signup.style.display = 'none';
      write.style.display = 'inline';
      updateCurrentUser(resp.user.email);
    });
    promise.catch((e) => console.log(e.message));
  });

  // logout
  logout.addEventListener('click', (e) => {
    firebase
      .auth()
      .signOut()
      .then((resp) => {
        console.log('Logout Response: ', resp);
        logout.style.display = 'none';
        login.style.display = 'inline';
        signup.style.display = 'inline';
        write.style.display = 'none';
        updateCurrentUser('');
      })
      .catch((e) => console.warn(e.message));
  });
})();
