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
        this.calcularRestante();
    }

    calcularRestante() {
        const gastado = this.gastos.reduce((total, gasto) => total + gasto.cantidad, 0); // El total lo acumula en total y va sumando cada gasto.cantidad, empezando por 0
        this.restante = this.presupuesto - gastado;
        console.log(this.restante);
    }

    eliminarGasto(id) {
        this.gastos = this.gastos.filter(gasto => gasto.id !== id); // Trae todo menos el id que coincide
        this.calcularRestante();
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

    mostrarGastos(gastos) {

        this.limpiarHTML(); // Elimina el HTML previo

        // Iterar sobre los gastos
        gastos.forEach( gasto => {
            const {cantidad, nombre, id} = gasto;
            
            // Crear LI
            const nuevoGasto = document.createElement('LI');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center'; // Diferencia en classList y className, la primera nos dice que clase ahi y con .add o remove sea agregan o eliminan, mientras que el ultimo solo dice que clase hay pero si se le pone = se le puede asignar un valor diferente
            nuevoGasto.dataset.id = id; // Lo que hace dataset es que en este caso al li le agrega el atributo data-(nombre-después-del-punto), ejemplo dataset.id o dateset.cliente


            // Agregar el HTML de gasto
            nuevoGasto.innerHTML = `${nombre} <span class="badge badge-primary badge-pillar">$ ${cantidad} </span>`;


            // Botón para borrar gasto
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
            btnBorrar.innerHTML = `Borrar &times`;
            btnBorrar.onclick = () => {
                eliminarGasto(id);
            }
            nuevoGasto.appendChild(btnBorrar);


            // Agregar al HTML
            gastoListado.appendChild(nuevoGasto)
        });
    }

    limpiarHTML() {
        while (gastoListado.firstChild) {
            gastoListado.removeChild(gastoListado.firstChild);
        }
    }

    actualizarRestante(restante) {
        document.querySelector('#restante').textContent = restante;
    }

    comprobarPresupuesto(presupuestoObj) {
        const {presupuesto, restante} = presupuestoObj;
        const restanteDiv = document.querySelector('.restante');

        // Comprobar 25% 
        if ((presupuesto / 4) > restante) { // Si es mayor, hemos gastado mas del 75%
            restanteDiv.classList.remove('alert-success', 'alert-warning');
            restanteDiv.classList.add('alert-danger');
        } else if ((presupuesto / 2) > restante) {
            restanteDiv.classList.remove('alert-success');
            restanteDiv.classList.add('alert-warning');
        } else {
            restanteDiv.classList.remove('alert-danger', 'alert-warning');
            restanteDiv.classList.add('alert-success');
        }

        // Si el total es menor a 0
        if (restante <= 0) {
            ui.imprimirAlerta('El presupuesto se ha agotado', 'error');

            // Deshabilitar botos de agregar
            formulario.querySelector('button[type="submit"]').disabled = true;
        }
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
    console.log(presupuesto);

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

    // Imprimir los gastos
    const {gastos, restante} = presupuesto;
    ui.mostrarGastos(gastos);

    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);
    
    // Reset formulario
    formulario.reset();
}

function eliminarGasto(id) {
    // Elimina gastos del objeto
    presupuesto.eliminarGasto(id);

    // Elimina los gastos del HTML
    const {gastos, restante} = presupuesto;
    ui.mostrarGastos(gastos);

    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);
}