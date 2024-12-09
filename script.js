// Abre (o crea) una base de datos IndexedDB llamada 'inscripciones'
let db;
const request = indexedDB.open('inscripciones', 1);

request.onerror = function(event) {
    console.log("Error al abrir la base de datos.", event);
};

request.onsuccess = function(event) {
    db = event.target.result;
};

request.onupgradeneeded = function(event) {
    db = event.target.result;
    // Crea un objeto 'inscripciones' en la base de datos si no existe
    if (!db.objectStoreNames.contains('inscripciones')) {
        db.createObjectStore('inscripciones', { keyPath: 'id', autoIncrement: true });
    }
};

// Función que se llama al enviar el formulario
function procesarFormulario(event) {
    event.preventDefault();

    // Obtener los valores del formulario
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const telefono = document.getElementById('telefono').value;  // Obtener el número de teléfono
    const fechaInscripcion = new Date().toLocaleString(); // Fecha de inscripción

    // Validar los datos
    if (nombre && email && telefono) {
        // Almacenar los datos en IndexedDB
        const transaction = db.transaction(['inscripciones'], 'readwrite');
        const store = transaction.objectStore('inscripciones');
        const inscripcion = { nombre: nombre, email: email, telefono: telefono, fechaInscripcion: fechaInscripcion };

        store.add(inscripcion); // Guardar los datos

        transaction.oncomplete = function() {
            // Mostrar mensaje de éxito
            document.getElementById('formulario').style.display = 'none';
            document.getElementById('mensaje').style.display = 'block';

            // Mostrar notificación de éxito
            if (Notification.permission === 'granted') {
                new Notification('¡Datos guardados!', {
                    body: Tu inscripción fue guardada exitosamente.,
                    icon: 'icono.png' // Puedes usar un ícono de tu elección
                });
            } else if (Notification.permission !== 'denied') {
                Notification.requestPermission().then(permission => {
                    if (permission === 'granted') {
                        new Notification('¡Datos guardados!', {
                            body: Tu inscripción fue guardada exitosamente.,
                            icon: 'icono.png'
                        });
                    }
                });
            }

            console.log('Datos guardados:', inscripcion);
        };

        transaction.onerror = function() {
            alert('Error al guardar los datos.');
        };
    } else {
        alert('Por favor, completa todos los campos.');
    }
}