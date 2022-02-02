import React from 'react';
import { useEffect, useState } from 'react';
import './Memes.css';



const Memes = () => {
  const [caption, setCaption] = useState([]);
  const [memeIndex, setMemeIndex] = useState(0);
  const [meme, setMeme] = useState([]);
  const [redirect, setRedirect] = useState('');

  const updateCaption = (e, index) => {
      const text = e.target.value || '';
      setCaption(
          caption.map((c, i) => {
              if(index == i){
                  return text;
              }
              else{
                  return c;
              }
          })
      );
  };

  const cookMeme = () => {
    const currMeme = meme[memeIndex];
    const fData = new FormData();

    fData.append('username', 'synkd');
    fData.append('password', process.env.REACT_APP_PS);
    fData.append('template_id', currMeme.id);

    caption.forEach((c, index) => fData.append(`boxes[${index}][text]`, c));

    fetch('https://api.imgflip.com/caption_image', {
        method : 'POST',
        body : fData
    }).then(res => {
        res.json().then(res => {
            console.log(res);
            setRedirect(res.data.url);
        })
    })
  };
 

  // Function to shuffle the ordering if the array
  const shuffle = (array) => {
      for(let i = array.length - 1; i > 0; i--){
          const j = Math.floor(Math.random() * i);
          const temp = array[i];
          array[i] = array[j];
          array[j] = temp;
      }
  };

  // API call to get the images for making memes.
  useEffect(() => {
    fetch('https://api.imgflip.com/get_memes').then(res => 
      res.json().then(res => {
        const temp = res.data.memes; // Process out the require data.
        shuffle(temp);
        setMeme(temp); // Updating meme value.
      }));
  }, []);

  useEffect(() => {
    if(meme.length){
        setCaption(Array(meme[memeIndex].box_count).fill(""));
    }
  }, [memeIndex, meme]);


    return (
     meme.length ? 
      <div className = 'container'>
            <h1>Meme Head!</h1>
           <div className = 'buttons'>
            <button className = 'new' onClick = {() => setMemeIndex(memeIndex+1)}>New!</button>
            <button className = 'cook' onClick = {cookMeme} >Cook</button>
          </div>
        {
            caption.map((c, index) => (
                <input onChange = {(e) => updateCaption(e, index)} key = {index}></input>
            ))
        }
        <img alt = 'meme' src = {meme[memeIndex].url} />
        {
            redirect.length ? 
            <button className = 'generated' onClick = {() => window.location.href = redirect }>Meme it!</button>:
            <></>
        }
          </div> :
     <></>
    );
}

export default Memes;
