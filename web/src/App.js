import React, { useState, useEffect } from 'react';
import api from './services/api';


import './global.css';
import './App.css';
import './Sidebar.css';
import './main.css';


function App() {

  const [ devs, setDevs] = useState([]);

  const [github_username, setGithub_username] = useState('');
  const [techs, setTechs] = useState('');

  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
    (position)=>{
      const { latitude, longitude } =  position.coords;

      setLatitude(latitude);
      setLongitude(longitude);

    },
    (err) =>{
      console.log(err);
    },
    {
      timeout: 30000,
    }
    )

  }, []);

  useEffect(() =>{
    async function loadDevs(){
      const response = await api.get('/devs');

      setDevs(response.data);
    }

    loadDevs();
  }, []);

  async function handleAddDev(e){
    e.preventDefault();

    const response = await api.post('/devs', {
      github_username,
      techs,
      latitude,
      longitude,
    });

    setGithub_username('');
    setTechs('');

    setDevs([...devs, response.data]) //é assim uma adição dentro de um array no js
    
  }

  

  return (
    <div id="app">
      <aside>
        <strong>Cadastrar</strong>
        <form onSubmit={handleAddDev}>
          <div className="input-block">
            <label htmlFor="github_username"> Usuario do Github</label>
            <input name="github_username" 
                   id="github_username"
                   required 
                   value = {github_username}
                   onChange = {e => setGithub_username(e.target.value)}

             />
          </div>


          <div className="input-block">
            <label htmlFor="techs"> Tecnologias</label>
            <input name="techs" 
                   id="techs" 
                   required 
                   value = {techs}
                   onChange = {e => setTechs(e.target.value)}
                   />
          </div>

          <div className="input-group">
            <div className="input-block">
              <label htmlFor="latitude"> Latitude </label>
              <input type="number"
                     name="latitude"
                     id="latitude" 
                     required 
                     value={latitude}
                     onChange = {e => 
                     setLatitude(e.target.value)} 
                     />
            </div>


            <div className="input-block">
              <label htmlFor="longitude"> Longitude </label>
              <input type="number"
                     name="longitude"
                     id="longitude"
                     required 
                     value={longitude}
                     onChange = {e => setLongitude(e.target.value)} 
                     />
                      
            </div>


          </div>

          <button type="submit">Salvar</button>
         </form>
      </aside>
      <main>
        <ul>
          {devs.map(dev => (
            <li key={dev._id} className="dev-item">
            <header>
              <img src= {dev.avatar_url} alt={dev.name}/>
              <div className="user-info">
              <strong>{dev.name}</strong>
              <span>{dev.techs.join(', ')}</span>
              </div>
            </header>
            <p>{dev.bio}</p>
            <a href={`https://github.com/${dev.github_username}`} target="noopener">Acessar perfil do Github</a>
          </li>
          ))}
          

        </ul>

      </main>
    </div>
  );
}

export default App;
