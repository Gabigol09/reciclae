import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importar o hook useNavigate
import './Jogo.css';
import lixo1 from './images/lixo1.png';
import lixo2 from './images/lixo2.png';
import lixo3 from './images/lixo3.png';
import lixo4 from './images/lixo4.png';
import cidade from './images/cidade.png'; // Imagem da cidade como fundo

const imagensLixo = [lixo1, lixo2, lixo3, lixo4];

const Jogo = () => {
  const [lixoCount, setLixoCount] = useState(0);
  const [lixos, setLixos] = useState([]);
  const [tempo, setTempo] = useState(30);
  const [nome, setNome] = useState('');
  const [ranking, setRanking] = useState([]);
  const [jogoEmAndamento, setJogoEmAndamento] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [gameOver, setGameOver] = useState(false);

  const navigate = useNavigate(); // Hook para navegação

  useEffect(() => {
    const interval = setInterval(() => {
      if (tempo > 0 && jogoEmAndamento) {
        setTempo(tempo - 1);
      } else if (tempo === 0) {
        clearInterval(interval);
        if (nome) {
          const novoRanking = [...ranking];
          const jogadorIndex = novoRanking.findIndex((jogador) => jogador.nome === nome);
          if (jogadorIndex === -1) {
            novoRanking.push({ nome, lixoCount });
          } else {
            novoRanking[jogadorIndex].lixoCount = Math.max(novoRanking[jogadorIndex].lixoCount, lixoCount);
          }
          setRanking(novoRanking.sort((a, b) => b.lixoCount - a.lixoCount).slice(0, 5));
          setGameOver(true);
        }
        setJogoEmAndamento(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [tempo, nome, lixoCount, ranking, jogoEmAndamento]);

  useEffect(() => {
    const gerarLixo = () => {
      const novoLixo = {
        id: Date.now(),
        x: Math.random() * (850 - 50) + 25,
        y: Math.random() * (460 - 50) + 25,
        imagem: imagensLixo[Math.floor(Math.random() * imagensLixo.length)],
      };
      setLixos((prevLixos) => [...prevLixos, novoLixo]);
    };

    const intervalLixo = setInterval(() => {
      if (jogoEmAndamento) {
        gerarLixo();
      }
    }, 1000);
    return () => clearInterval(intervalLixo);
  }, [jogoEmAndamento]);

  const coletarLixo = (id) => {
    setLixos(lixos.filter((lixo) => lixo.id !== id));
    setLixoCount(lixoCount + 1);
  };

  const iniciarJogo = () => {
    setLixoCount(0);
    setLixos([]);
    setTempo(30);
    setJogoEmAndamento(true);
    setShowModal(false);
    setGameOver(false);
  };

  const reiniciarJogo = () => {
    setLixoCount(0);
    setLixos([]);
    setTempo(30);
    setNome('');
    setJogoEmAndamento(false);
    setShowModal(true);
    setGameOver(false);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      {/* Botão de voltar */}
      <button
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          padding: '10px 20px',
          fontSize: '16px',
        }}
        onClick={() => navigate('/')} // Voltar para a página inicial
      >
        Voltar
      </button>

      <h1 style={{ margin: '0' }}>Super Coletor</h1>

      {showModal && (
        <div className="modal">
          <h2>Insira seu Nome</h2>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Digite seu nome"
          />
          <button onClick={iniciarJogo} disabled={!nome}>
            Começar Jogo
          </button>
        </div>
      )}

      {gameOver && (
        <div className="game-over">
          <h2>Fim de Jogo!</h2>
          <h3>Você coletou {lixoCount} itens de lixo.</h3>
          <h3>
            Sua posição no ranking: {ranking.findIndex((jogador) => jogador.nome === nome) + 1}
          </h3>
          <button onClick={reiniciarJogo}>Reiniciar Jogo</button>
        </div>
      )}

      {!gameOver && (
        <div className="scoreboard-timeboard">
          <div className="scoreboard">
            <h2>Ranking</h2>
            <ul>
              {ranking.map((jogador, index) => (
                <li key={index}>
                  {index + 1}. {jogador.nome} - {jogador.lixoCount} itens
                </li>
              ))}
            </ul>
          </div>

          <div className="timeboard">
            <h2>Itens coletados: {lixoCount}</h2>
            <h2>Tempo restante: {tempo}s</h2>
          </div>
        </div>
      )}

      <div className="game-container">
        <div className="game-area">
          {lixos.map((lixo) => (
            <img
              key={lixo.id}
              src={lixo.imagem}
              alt="Lixo"
              onClick={() => coletarLixo(lixo.id)}
              className="lixo-image"
              style={{
                position: 'absolute',
                left: lixo.x,
                top: lixo.y,
              }}
            />
          ))}
        </div>
      </div>

      {!jogoEmAndamento && !showModal && !gameOver && (
        <button onClick={reiniciarJogo}>Reiniciar Jogo</button>
      )}
    </div>
  );
};

export default Jogo;
