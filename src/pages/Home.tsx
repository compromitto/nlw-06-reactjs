import { useHistory } from 'react-router-dom'
import { FormEvent, useState, Component } from 'react';
import firebase from 'firebase';

import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg';
import googleIconImg from '../assets/images/google-icon.svg';
import facebookIconImg from '../assets/images/facebook-icon.svg';

import { database } from '../services/firebase';

import { Button } from '../components/Button';
import { useAuth } from '../hooks/useAuth';

import '../styles/auth.scss';


export function Home() {
  const history = useHistory();
  const { user, signInWithGoogle} = useAuth()
  const [roomCode, setRoomCode] = useState('');

  async function handleCreateRoom() {
    if (!user) {
      await signInWithGoogle() ;
    } 

    history.push('/rooms/new');
  }
// criar facebook 
class App extends Component {
  state = { isSignedIn: false }
  uiConfig = {
    signInFlow: "popup",
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID
    ],
    callbacks: {
      signInSuccess: () => false
    }
  }

  componentDidMount = () => {
    firebase.auth().onAuthStateChanged(user => {
      this.setState({ isSignedIn: !!user })
      console.log("user", user)
    })
  }}
// lo

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault();

    if (roomCode.trim() === '') {
      return;
    }

    const roomRef = await database.ref(`rooms/${roomCode}`).get();

    if (!roomRef.exists()) {
      alert('Room does not exists.');
      return;
    }

    if (roomRef.val().endedAt) {
      alert('Room already closed.');
      return;
    }

    history.push(`/rooms/${roomCode}`);
  }
  
  return (
    <div id="page-auth">
      <aside>
        <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
        <strong>Crie PIX com QR-Code</strong>
        <p>Crie em tempo-real o QR-CODE para seus pagamentos via PIX</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={logoImg} alt="Gera pix" />

          <button onClick={handleCreateRoom} className="create-room">
            <img src={googleIconImg} alt="Logo do Google" />
            Crie sua conta com o Google
          </button>
          <button onClick={handleCreateRoom} className="create-room-fb">
            <img src={facebookIconImg} alt="Logo Facebook" />
            Crie sua conta com o facebook
          </button>
          <div className="separator">ou entre com nome e e-mail.</div>
          <form onSubmit={handleJoinRoom}>
            <label> Nome:
          <input 
              type="text" 
              placeholder="Digite seu nome"
              onChange={event => setRoomCode(event.target.value)}
              value={roomCode}
            /></label>
            <label>E-mail:<input 
            type="text"
            placeholder="Digite seu e-mail"
            onChange={event => setRoomCode(event.target.value)}
            value={roomCode}
          /></label>
           <Button type="submit">
              Entrar na sala
            </Button>
          <div className="separator">ou entre em uma sala</div>
            <input 
              type="text"
              placeholder="Digite o código da sala"
              onChange={event => setRoomCode(event.target.value)}
              value={roomCode}
            />
            <Button type="submit">
              Entrar na sala
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}