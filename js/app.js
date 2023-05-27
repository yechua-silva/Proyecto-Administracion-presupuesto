// Variables y selectores
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');


// Eventos
eventListener();
function eventListener() {
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto );
}



// Clases
class Presupuesto {
    constructor(presupuesto) {
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gatos = [];
    }
}

class UI {
    insertarPresupuesto( cantidad ) {
        // Extrayendo valores
        const {presupuesto, restante} = cantidad;

        // Agregar al HTML
        document.querySelector('#total').textContent = presupuesto;      
        document.querySelector('#restante').textContent = restante;      
    }
}

// Instanciar
const ui = new UI();
let presupuesto;



// Funciones
function preguntarPresupuesto() {
    const presupuestoUsuario = prompt('¿Cual es tu presupuesto?');

    //console.log(Number(presupuestoUsuario));

    // Validación prompt
    if (presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0) {
        window.location.reload(); // Recarga la pagina
    }

    // Presupuesto valido
    presupuesto = new Presupuesto(presupuestoUsuario);
    //console.log(presupuesto);

    ui.insertarPresupuesto(presupuesto);
}