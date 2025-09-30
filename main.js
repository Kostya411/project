//....................................................................................MODEL хранение данных, логика
const model = {
    //................................ Хранение массив свойство
    notes: [
        // {
        //     color: "yellow",
        //     id: 1758768775467,
        //     isFavorite: false,
        //     text: "1",
        //     title: "1",
        // }
    ],

    favoriteCheckSave: false,

    //............................... Метод добавление в массив
    addNote(newNote) {
        console.log(this.notes)
        const id = new Date().getTime()
        const isFavorite = false;
        const note = {id, isFavorite, ...newNote}

        this.notes.unshift(note);

        view.renderNotes(this.notes)
    },

    //..................................... Метод удаления из массива
    deleteNote(noteId) {
        this.notes = this.notes.filter((note) => note.id !== noteId)
        view.renderNotes(this.notes);
    },

    //..................................... Метод изменение статуса "избранное" в массиве
    favoriteNote(noteId) {
        this.notes.forEach(
            (note) => {
                if (note.id === noteId) {
                    note.isFavorite = !note.isFavorite
                }
                console.log(note)
                return note;
            })
        view.renderNotes(this.notes);
    },

    favoriteView(favoriteCheck) {
        this.favoriteCheckSave = favoriteCheck;
        if (this.favoriteCheckSave) {
            view.renderNotes(this.notes.filter((note) => note.isFavorite))
        } else {
            view.renderNotes(this.notes)
        }
    }
}

//........................................................................ VIEW отображение данных: рендер задач, размещение обработчиков событий
const view = {

    //................................................... Инициализация, рендер страницы, навешиваем события
    init() {

        //............................................ Рендер вызываем метод
        this.renderNotes(model.notes)

        //....................................... Обработка формы
        const form = document.querySelector('#form-note');

        form.addEventListener('submit', (event) => {
            event.preventDefault()
            const title = document.querySelector('.input-name-note').value;
            const text = document.querySelector('.textarea-note').value;
            const colorInput = document.querySelector('.radio-group input[name="colorNote"]:checked');

            const color = colorInput ? colorInput.value : 'yellow';

            if (title === "") {
                console.log("error-title1")
                this.showNotification("Заголовок не указан", "red", "error")
            } else {
                if (text === "") {
                    console.log("error-text1")
                    this.showNotification("Описание не заполнено", "red", "error")
                } else {
                    if (title.length >= 50) {
                        console.log("error-title2")
                        this.showNotification("Максимальная длина заголовка - 50 символов", "red", "error")
                    } else {
                        const newNote = {
                            title: title,
                            text: text,
                            color: color,
                        }
                        controller.addNote(newNote);
                        form.reset();
                        this.showNotification("Заметка добавлена!", "green", "good")
                    }
                }
            }


        })

        //............................................... Вешаем события на заметки
        const element = document.querySelector('.list');

        element.addEventListener('click', (event) => {
            console.log("event")
            if (event.target.id === ('deleteButton')) {
                const taskId = +event.target.parentElement.parentElement.id
                console.log('taskId delete', taskId)
                controller.deleteNote(taskId);
                this.showNotification("Заметка удалена!", "green", "good")
            }
            if (event.target.id === ('favoriteButton')) {
                const taskId = +event.target.parentElement.parentElement.id
                controller.favoriteNote(taskId);
                console.log('taskId favorite', taskId)
                console.log('favorite')
            }

            const favoriteCheckbox = document.querySelector('#checkbox-favorites-only');

            favoriteCheckbox.addEventListener('change', (event) => {
                console.log('Checked?', event.target.checked);
                controller.favoriteView(event.target.checked)
            });


        })

        //................................................... Вешаем событие на чекбокс для избранного
        // const checkFavorite = document.querySelector('.checkbox');
        // checkFavorite.addEventListener('click', (event) => {
        //     console.log('checkFavorite')
        // })
    },

    //.................................................................................. Метод рендер
    renderNotes(notes) {
        const list = document.querySelector('.list');
        let notesHTML = '';

        //.............................................если заметки есть
        if (notes.length > 0) {
            list.innerHTML =
                ` ${viewFavoriteCheckbox()}
        <div class="notes-area-wrapper">
            ${viewNotes(notes)}
        </div>`;

            const checkbox = document.getElementById('checkbox-favorites-only');
            checkbox.checked = model.favoriteCheckSave;

            //...............................................если заметок нет
        } else {
            if (model.favoriteCheckSave) {
                list.innerHTML = `${viewFavoriteCheckbox()} ${viewNoFavoriteElement()}`

                const checkbox = document.getElementById('checkbox-favorites-only');
                checkbox.checked = model.favoriteCheckSave;
            } else {
                list.innerHTML = viewNoElement();
            }

        }

        //............................................................функции для рендера разметки

        //............................................................разметка заметок
        function viewNotes(notes) {

            for (let i = 0; i < notes.length; i++) {
                const note = notes[i];

                notesHTML += `
            <div class="a-note" id="${note.id}">
                <div class="header-note-wrapper ${note.color}" >
                    <h2 class="header-note">${note.title}</h2>
                    <img id="favoriteButton" class="note-button" ${note.isFavorite ? 'src="./assets/images/heart%20active.svg" ' : 'src="./assets/images/heart%20inactive.svg" '} alt="favorite">
                    <img id="deleteButton" class="note-button" src="./assets/images/delete.svg" alt="delete-button">
                </div>
                <p class="note-text">
                    ${note.text}
                </p>
            </div>`
            }
            return notesHTML;
        }

        //............................................................разметка чекбокса избранных заметок
        function viewFavoriteCheckbox() {
            return `  
                <div class="checkbox-favorites-only-wrapper">
                    <!--                    тут будем менять через js, временно заглушку-->
                    <form id="id-favorite">
                    <input type="checkbox" id="checkbox-favorites-only" style="display: none;">
                    <label for="checkbox-favorites-only" class="favorites-label">
                    <img src="./assets/images/checkbox%20inactive.svg" alt="checkbox-favorite" class="favorites-only-checkbox" id="svg-favorites-off">
                    <img src="./assets/images/checkbox%20active.svg" alt="checkbox-favorite" class="favorites-only-checkbox" id="svg-favorites-on">
                    <div class="favorites-only-text"> Показать только избранные заметки </div>
                    </label>
                    </form> 
                </div>`
        }

        //............................................................разметка когда нет элементов
        function viewNoElement() {
            return `            
            <div class="no-notes-wrapper">
                <p class="no-notes-text">
                    У вас нет еще ни одной заметки
                    <br>
                        Заполните поля выше и создайте свою первую заметку!
                </p>
            </div>`

        }
        function viewNoFavoriteElement() {
            return `            
            <div class="no-notes-wrapper">
                <p class="no-notes-text">
                    У вас нет еще ни одной избранной заметки
            
                </p>
            </div>`

        }

        //...........................................................отображение количества заметок
        const value = document.querySelector(".quantity-value")
        value.textContent = notes.length;
    },

    //................................................................................................... Метод отображения всплывающего
    showNotification(message, colorNotification, symbol, duration = 3000) {
        const container = document.getElementById("notificationContainer");

        const notification = document.createElement("div");
        notification.className = "notification";

        switch (colorNotification) {
            case "red":
                notification.classList.add("redNotification");
                break;
            case "green":
                notification.classList.add("greenNotification");
                break;
            default:
                notification.classList.add("yellowNotification");
                break;
        }

        let symbolSvg;
        switch (symbol) {
            case "good":
                symbolSvg = `<img src="./assets/images/Done.svg"  alt="good"/>`;
                break;
            case "error":
                symbolSvg = `<img src="./assets/images/warning.svg"  alt="warning"/>`;
                break;
            default:
                symbolSvg = "error-symbol";
                break;
        }
        notification.innerHTML = symbolSvg + message;


        container.appendChild(notification);

        requestAnimationFrame(() => {
            notification.classList.add("show");
        });

        setTimeout(() => {
            notification.classList.remove("show");
            setTimeout(() => {
                container.removeChild(notification);
            }, 300);
        }, duration);
    },
}

//........................................................................ Controller обработка действий пользователя, обновление модели
const controller = {

    //Функция передачи новой заметки в model
    addNote(newNote) {
        model.addNote(newNote);
    },

    //Удаление заметки
    deleteNote(noteId) {
        model.deleteNote(noteId);
    },

    //Избранное
    favoriteNote(noteId) {
        model.favoriteNote(noteId);
    },

    //отобразить только избранное
    favoriteView(favoriteCheck) {
        model.favoriteView(favoriteCheck);
    }
}


//........................................................................ Инициализация после загрузки DOM страницы
function init() {
    view.init()
}

document.addEventListener('DOMContentLoaded', function () {
    console.log('HTML разобран и DOM дерево построено.');
    init()
});
