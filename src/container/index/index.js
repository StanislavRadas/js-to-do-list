export class Todo {
    static #NAME = 'todo'
    static #list = []
    static #count = 0

    static #saveData = () => {
        localStorage.setItem(
            this.#NAME,
            JSON.stringify({
                list: this.#list,
                count: this.#count,
            }),
        )
    }

    static #loadData = () => {
        const data = localStorage.getItem(this.#NAME)
        if (data) {
            const { list, count } = JSON.parse(data)
            this.#list = list
            this.#count = count
        }
    }

    static #createTaskData = (text) => {
        this.#list.push({
            id: ++this.#count,
            text,
            done: false,
        })
    }

    static #block = null
    static #template = null
    static #input = null
    static #button = null

    static init = () => {
        this.#template = document.getElementById('task').content.firstElementChild
        this.#block = document.querySelector('.list__block')
        this.#input = document.querySelector('.input')
        this.#button = document.querySelector('.button')
        
        this.#button.onclick = this.#handleAdd
        this.#loadData()
        this.#render()
    }

    static #handleAdd = () => {
        this.#createTaskData(this.#input.value)
        this.#input.value = '' 
        this.#render()
        this.#saveData()
    }

    static #render = () => {
        this.#block.innerHTML = ''
        if (this.#list.length === 0) {
            this.#block.innerText = 'Task list is empty!'
        } else {
            this.#list.forEach((taskData) => {
                const el = this.#createTaskElem(taskData)
                this.#block.append(el)
            })
        }
    }

    static #createTaskElem = (data) => {
        const el = this.#template.cloneNode(true)
        const [id, text, btnDo, btnCancel] = el.children
        id.innerText = `${data.id}`
        text.innerText = data.text
        btnCancel.onclick = this.#handleCancel(data)
        btnDo.onclick = this.#handleDo(data, btnDo, el)
        if (data.done) {
            el.classList.toggle('list--done')
            btnDo.classList.toggle('button__task--do')
            btnDo.classList.toggle('button__task--done')
        }
        return el
    }

    static #handleDo = (data, btn, el) => () => {
        const result = this.#toggleDone(data.id)
        if (result === true || result === false) {
            el.classList.toggle('list--done')
            btn.classList.toggle('button__task--do')
            btn.classList.toggle('button__task--done')
            this.#saveData()
        }
    }

    static #toggleDone = (id) => {
        const task = this.#list.find((item) => item.id === id)
        if (task) {
            task.done = !task.done
            return task.done
        } else {
            return null
        }
    }

    static #handleCancel = (data) => () => {
        if (confirm('Delete task?')) {
            const result = this.#deleteById(data.id)
            if (result) this.#render()
            this.#saveData()
        }
    }

    static #deleteById = (id) => {
        this.#list = this.#list.filter((item) => item.id !== id)
        return true
    }
}

Todo.init()

window.todo = Todo