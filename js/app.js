// Variables y selectores
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');


// Eventos
eventListener();
function eventListener() {
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto );

    formulario.addEventListener('submit', agregarGasto)
}



// Clases
class Presupuesto {
    constructor(presupuesto) {
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }

    nuevoGasto(gasto) {
        this.gastos = [...this.gastos, gasto]
        console.log(this.gastos);
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

    imprimirAlerta( mensaje, tipo ) {
        // Crear div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert');

        if (tipo === 'error') {
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success');
        }
        
        //Mensaje de error
        divMensaje.textContent = mensaje;

        // Insertar HTML
        document.querySelector('.primario').insertBefore(divMensaje, formulario)

        // Quitar HTML
        setTimeout(() => {
            divMensaje.remove();
        }, 2000);
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

// Añade gastos
function agregarGasto(e) {
    e.preventDefault();

    // Leer datos del formulario
    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);

    // Validar
    if (nombre === '' || cantidad === '') {
        ui.imprimirAlerta('Ambos campos son obligatorios', 'error');

        return;
    } else if ( cantidad <= 0 || isNaN(cantidad) ) {
        ui.imprimirAlerta('Cantidad no valida', 'error');
    
        return;
    }

    // General un objeto con el gasto 
    const gasto = {nombre, cantidad, id: Date.now()}; // Sintaxis similar a destructuring, pero lo contrario, en vez de sacar nombre y cantidad de gasto, los estamos agregando a gasto, se conoce como object literal enhancement
    
    // Añade un nuevo gasto
    presupuesto.nuevoGasto(gasto);

    // Imprimir mensaje de todo bien
    ui.imprimirAlerta('Correcto')
    
    // Reset formulario
    formulario.reset();
}