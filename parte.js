//Drag and Drop: arrastar cards entre colunas 
let cardArrastado = null;

//criar card
function criarCard(colunaId) {
    const texto = prompt("Digite o texto do card:");
    if (!texto) return;

    const card = document.createElement("div"); //cria o card
    card.className = "card"; // aplica estilo
    card.textContent = texto;
    card.draggable = true; //permite arrastar 

    //conteudo do card
    card.innerHTML = `
    <span class ="texto">${texto}</span>
    <div class="acoes">
     <button class="editar">✏</button>
     <button class="excluir">❌</button>
      </div>
     `

    adicionarEventos(card);

    document.getElementById(colunaId).appendChild(card); //appenChild coloca na coluna
}
//eventos do card
function adicionarEventos(card) {
    // começar a arrastar 
    card.addEventListener("dragstart" , (e) => {  //dragstart: quando começar a arrastar guarda o card numa varíavel
        cardArrastado = card;
    //suporte a toque touch, mover no celular
    card.addEventListener("touchstart",() =>{
        cardArrastado = card;
});


    });
 
    //editar texto
    card.addEventListener("dblclick", () => { //dblclick: editar o texto 
        const novoTexto = prompt("Editar card:", card.textContent);
        if (novoTexto) card.textContent = novoTexto;
    });
   
     const texto = card.querySelector(".texto");
     const btnEditar = card.querySelector(".editar");
     const btnExcluir = card.querySelector(".excluir");
       
    // excluir
     btnExcluir.addEventListener("click", () => {
     card.remove();
  });

}

//Permitir soltar nas colunas
document.querySelectorAll(".coluna").forEach(coluna => {
 
     //touch nas colunas
     coluna.addEventListener("touchend", () => {
  if (cardArrastado) {
    coluna.appendChild(cardArrastado);
    cardArrastado = null;
    salvarEstado(); // importante já que você tem localStorage
  }
});

    coluna.addEventListener("dragover", (e) => {
        e.preventDefault();
    });

    coluna.addEventListener("drop", () => {
        if (cardArrastado){
        coluna.appendChild(cardArrastado);
        cardArrastado = null;
        }
    });
});

function salvarEstado() {
  const dados = {};

  coluna.addEventListener("drop", () => {
    coluna.appendChild(cardArrastado);
    cardArrastado = null;
    salvarEstado;
  })

  document.querySelectorAll(".coluna").forEach(coluna => {
    const id = coluna.id;
    dados[id] = [];

    coluna.querySelectorAll(".card .texto").forEach(card => {
      dados[id].push(card.textContent);
    });
  });

  localStorage.setItem("kanban", JSON.stringify(dados));
}

function carregarEstado() {
  const dados = JSON.parse(localStorage.getItem("kanban"));
  if (!dados) return;

  for (let colunaId in dados) {
    dados[colunaId].forEach(texto => {
      criarCardComTexto(colunaId, texto);
    });
  }
}
carregarEstado();
