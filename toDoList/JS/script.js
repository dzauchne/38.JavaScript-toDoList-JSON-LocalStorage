"strict use";
// LOcalSTORAGE & JSON (HOMEWORK)
// TO DO app

// В самом простом виде это будет инпут для ввода задач и список задач с чекбоксами для маркировки задач как сделанных.

// Дальше можно добавлять (сколько успеете, на следующем занятии будем продолжать с момента, на котором остановились на этом занятии):

// 1. Перечеркивание задачи при маркировке как сделанной

// 2. Удаление задач

// 3*. Перемещение задачи в конец списка при маркировке как сделанной

// 4*. Редактирование задач

// 5*. Стилизовать приложение используя bootstrap https://getbootstrap.com/

// 6*. Категории задач, заданные изначально. Напр. "срочные", "несрочные". Выбор категории при создании задачи. Отображение в списке, редактирование

// 7*. Сохранение задач в local storage https://learn.javascript.ru/localstorage. Для того, чтобы задачи не терялись при перезагрузке страницы, при перезагрузке компьютера.


// 8*. Категории задач, заданные пользователем

// 9*. Задавать дату дедлайна для задачи. Можно добавить 3 инпута (день, месяц, год). Можно использовать готовую библиотеку https://bootstrap-datepicker.readthedocs.io/en/latest/





document.addEventListener('DOMContentLoaded', () => {
    //можно через defer

    const btnAddForm = document.querySelector('.plus');
    console.log(btnAddForm);
    const listLi = document.querySelector('.tasklist');
    console.log(listLi);
    const btnAddList = document.querySelector('.add-button');
    console.log(btnAddList);
    let data = [];
    const localStorageData = localStorage.getItem("data")
    if (localStorageData) {
        data = JSON.parse(localStorageData)
    }
    const btnDlt = document.querySelectorAll('.dlt');
    const allTaskBtn=document.querySelector('.all__task');
    const activeTaskBtn=document.querySelector('.active__task');
    const finishedTaskBtn=document.querySelector('.finished__task');


    const STATE = {
        ALL: "all",
        ACTIVE: 'active',
        COMPLETED: 'completed'
    }
    let status = STATE.ALL;
    console.log(btnDlt);

    allTaskBtn.addEventListener('click', ()=>{
        status= STATE.ALL
        createList(data);
    })
    activeTaskBtn.addEventListener('click', ()=>{
        status= STATE.ACTIVE
        createList(data);
    })
    finishedTaskBtn.addEventListener('click', ()=>{
        status=STATE.COMPLETED
        createList(data);
    })


    //обработчики
    //1
    btnAddForm.addEventListener('click', () => {
        const taskBar = document.querySelector('.taskbar');
        console.log(taskBar);
        taskBar.classList.toggle('none');//убирает и добавляет класс , в моём случае "taskBar"
        createList(data);//отрисовка данных
    })
    btnAddList.addEventListener('click', handleClickAddData);



    //5.   через делигирование  
    listLi.addEventListener('click', (event) => {
        const parent = event.target.parentNode;
        console.log(parent);
        if (event.target.tagName == 'INPUT') {
            //при нажатии на checkbox, в консоли срабатывает ок и перечёркивает 
            console.log('okey');
            //чтобы обратиться с checkbox к тесту , надо его родителя вывести
            parent.querySelector('.text').classList.toggle('line')
            //parent.querySelector(input).setAttribute('checked');
            const id = parent.querySelector('div').id
            const idArray = data.findIndex(item => item.id == id)// перебор массива  на предмет, какой id  в массиве наш id
            data[idArray].isCompleted = !data[idArray].isCompleted
            createList(data)
        } else if (event.target.tagName == 'DIV') {
            parent.remove();

            data.forEach((item, id) => {
                if (event.target.id == item.id) {
                    data.splice(id, 1)
                }
            })
            localStorage.setItem("data", JSON.stringify(data));//6.сохраняем данные ввода в хранилище
        }
    })

    function updateData() {//7.функция  актуализации сервера
        data.sort(item => {
            if (item.isCompleted === true) {
                return 1
            } else {
                return -1
            }
        })
        localStorage.setItem("data", JSON.stringify(data));

    }

    //
    btnDlt.forEach((item) => {
        item.addEventListener('click', () => {
            const parent = item.parentNode;
            parent.remove();
        })
    })




    //functions 
    //4 отвечает присвоение  checkbox  введённого в инпуте таска;  
    function handleClickAddData() {
        const input = document.querySelector('.enter-field');
        let taskListInput = document.querySelector('.to__check');
        taskListInput = input.value.trim();
        data.push({ listLi: taskListInput, isCompleted: false, id: (new Date()).getTime() + Math.random().toString(16).slice(2) })//создав уникальный id-шник, cоздаём объект и добавляем в конец массива

        console.log(data);
        input.value = '';//чистим
        createList(data);
    }



    //3 отрисовываем данные - рендер
    function createList(data = []) {
        updateData()
        listLi.innerHTML = '';
        let newArrayData = data;
        if (STATE.COMPLETED === status) {
            newArrayData = data.filter(item=> item.isCompleted)
        } else if (STATE.ACTIVE === status) {
            newArrayData = data.filter(item=> !item.isCompleted)
        }//else if{STATE.ALL === status} {newArrayData = data}
        newArrayData.forEach((item) => {//rendering
            listLi.innerHTML += createListItem(item);
        })




    }
    createList(data);




    //2 преобразует из нашего массива содержание в шаблон html
    function createListItem({ listLi, isCompleted, id }) {

        const template = `<li class='task'>
        <input ${isCompleted ? "checked" : ""} type='checkbox'/>
        <span class='text ${isCompleted ? "line" : ''}'>${listLi}</span> 
        <div id=${id} class="dlt">&#9447;</div>
        </li>`;
        return template;
    }
});