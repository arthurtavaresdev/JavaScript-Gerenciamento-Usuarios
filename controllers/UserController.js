class UserController {
 
    constructor(formId, formIdUpdate, tableId) {
 
        this.formEl = document.getElementById(formId);
        this.formUpdateEl = document.getElementById(formIdUpdate);
        this.tableEl = document.getElementById(tableId);
     
        this.onSubmit();
        this.onEdit();
     
    } // Fechando o Constructor
    onEdit() {
 
        document.querySelector("#box-user-update .btn-cancel").addEventListener("click", e => {
 
            this.showPanelCreate();
 
        });
 
 
    } // Fechando o Método onEditCancel()
 
    onSubmit() {
 
        this.formEl.addEventListener("submit", event => {
 
            event.preventDefault();
 
            let btn = this.formEl.querySelector("[type=submit]")
 
            btn.disable = true;
 
            let values = this.getValues();
 
            if (!values) return false;
 
            this.getPhoto().then(
                (content) => {
                    values.photo = content;
 
                    this.addLine(values);
 
                    this.formEl.reset();
 
                    btn.disable = false;
                },
                (e) => {
                    console.error(e)
                });
 
        });
 
 
    } // Fechando o Método onSubmit();
 
 
    getPhoto() {
 
        return new Promise((resolve, reject) => {
 
            let fileReader = new FileReader();
 
            let elements = [...this.formEl.elements].filter(item => {
 
                if (item.name === "photo") {
                    return item;
                }
            })
 
            let file = elements[0].files[0];
 
            fileReader.onload = () => {
 
                resolve(fileReader.result)
 
            };
 
            fileReader.onerror = (e) => {
                reject(e);
            }
 
            if (file) {
                fileReader.readAsDataURL(file);
            } else {
                resolve("dist/img/avatar04.png");
            }
        })
 
 
 
    } // Fechando o Método getPhoto();
 
    showPanelCreate() {
 
        document.querySelector("#box-user-create").style.display = "block";
        document.querySelector("#box-user-update").style.display = "none";
 
    }
 
 
    showPanelUpdate() {
 
        document.querySelector("#box-user-create").style.display = "none";
        document.querySelector("#box-user-update").style.display = "block";
 
    }
 
    getValues() {
 
        let user = {};
        let isValid = true;
 
        [...this.formEl.elements].forEach((field, index) => {
 
            if (['name', 'email', 'country', 'birth', 'password'].indexOf(field.name) > -1 && !field.value) {
 
                field.parentElement.classList.add("has-error");
                isValid = false;
            }
 
 
            if (field.name == "gender") {
 
                if (field.checked) {
                    user[field.name] = field.value;
                }
 
            } else if (field.name == "admin") {
 
                user[field.name] = field.checked;
            } else {
 
                user[field.name] = field.value;
 
            }
        }); // Fechando função anônima;
        if (!isValid) {
            return false;
        }
        return new User(
            user.name,
            user.gender,
            user.birth,
            user.country,
            user.email,
            user.password,
            user.photo,
            user.admin
        );
    }  // Fechando o Método getValues();
 
    addLine(dataUser) {
 
        let tr = document.createElement("tr");
 
        tr.dataset.user = JSON.stringify(dataUser);
 
        tr.innerHTML =
            `
            <tr>
                <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
                <td> ${dataUser.name}</td>
                <td>${dataUser.email}</td>
                <td>${(dataUser.admin) ? "Sim" : "Não"}</td>
                <td>${(Utils.dateFormat(dataUser.register))} </td>
                <td>
                    <button type="button" class="btn btn-primary btn-xs btn-flat btn-edit">Editar</button>
                    <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
                </td>
            </tr> 
        `;
 
        tr.querySelector(".btn-edit").addEventListener("click", e => {
 
            let json = JSON.parse(tr.dataset.user);
            let form = document.querySelector("#form-user-update");
 
            for (let name in json) {
 
                let field = form.querySelector("[name=" + name.replace("_", "") + "]");
 
 
 
                if (field) {
 
                    switch (field.type) {
 
                        case 'file':
                            continue;
                            break;
 
                        case 'radio':
                        field = form.querySelector("[name=" + name.replace("_", "") + "][value=" + json[name] + "]");
                        console.log(field);
                        field.checked = true; 
                        break;

                        case 'checkbox':
                            field.checked = json[name];
 
                            break;
 
                        default:
                            field.value = json[name];
 
                    } // Fechando switch 
 
                }
 
            }
 
            this.showPanelUpdate();
 
        })
 
        this.tableEl.appendChild(tr);
 
        this.updateCount();
 
 
    }  // Fechando o Método addLine()
 
 
 
    updateCount() {
 
        let numberUsers = 0;
        let numberAdmins = 0;
 
        [...this.tableEl.children].forEach(tr => {
 
            numberUsers++;
 
            let user = JSON.parse(tr.dataset.user);
 
            if (user._admin) numberAdmins++;
 
        });
 
        document.querySelector("#number-users").innerHTML = numberUsers;
        document.querySelector("#number-admins").innerHTML = numberAdmins;
 
    } // Fechando o Método updateCount()
 
} // Fechando a classe UserController;