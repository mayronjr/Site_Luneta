import {FBDatabase, FBStorage} from '../Utils/firebaseUtils'

export default class FirebaseService {
    //Pegando, salvando e deletando imagens
    static deleteImage = async(path) => {
        var storageRef = FBStorage.ref()
        storageRef.child(path).delete()
    }
    static downloadImage = async(path, elementId) => {
        var storageRef = FBStorage.ref()
        storageRef.child(path).getDownloadURL().then(function(url) {
            var img = document.getElementById(elementId);
            img.src = url;
        })
    }
    static uploadImage = async(file, index, ID, callback) =>{
        //Obtendo a referencia do arquivo
        var id
        if(ID === undefined){
            id = FBDatabase.ref('Noticia').push().key
        }else{
            id = ID
        }
        var type = String(file.type).split('/')[1]
        var fileName = id + '/item' + index + "." + type
        var storageRef = FBStorage.ref()
        var ImageRef = storageRef.child('images/' + fileName)
        //Salvando o arquivo
        await ImageRef.put(file).then(function(Snapshot){
            var image = Snapshot.metadata
            var fullpath = image.fullPath
            callback({id: id, fullpath: fullpath})
            FirebaseService.downloadImage(fullpath, id + "item" + index)
        })
    }
    //Pegando, salvando e deletando Usuarios
    static writeUserData = async(user) =>{
        FBDatabase.ref('Users/' + user.name).set({
            pass: user.pass,
            adm: user.adm
        })
    }
    static updateUserData = async(user, callback) =>{
        let OldUser = {}
        await FBDatabase.ref('Users/' + user.name).once('value', dataSnapshot => {
            OldUser['name'] = dataSnapshot.key
            OldUser['OldPass'] = dataSnapshot.val().pass
            OldUser['pass'] = user.pass
            OldUser['adm'] = dataSnapshot.val().adm
        });
        if(OldUser.OldPass !== OldUser.pass){
            this.writeUserData(OldUser)
            callback("Sucess")
        }else{
            callback("Error")
        }
    }
    static getAllUserData = async(callback) =>{
        await FBDatabase.ref('Users').on('value', dataSnapshot => {
            let items = [];
            dataSnapshot.forEach(childSnapshot => {
                let item = childSnapshot.val();
                item['key'] = childSnapshot.key;
                item['name'] = childSnapshot.key;
                items.push(item);
            });
            callback(items);
        });
    }
    static UserIsAdm = async(key)=>{
        let adm
        await FBDatabase.ref('Users/' + key).once('value', dataSnapshot => {
            adm = dataSnapshot.val().adm
        });
        return adm
    }
    static deleteUser = async(key) =>{
        let nots = []
        await FBDatabase.ref('Noticias').once('value', dataSnapshot =>{
            let items = [];
            dataSnapshot.forEach(childSnapshot=>{
                let item = childSnapshot.val().Editores.find(
                    (editor => {
                        if (editor.name === key) return true
                        else return false
                    })
                )
                if(item !== undefined){
                    let permits = 0
                    for(let j in childSnapshot.val().Editores){
                        if(childSnapshot.val().Editores[j].permit){
                            permits += 1
                        }
                    }
                    if(item.permit && permits === 1){
                        item = childSnapshot.val()
                        item['id'] = childSnapshot.key
                        items.push(item)
                    }
                }
            })
            nots = items
        })
        for(let i in nots){
            for(let j in nots[i].Editores){
                let adm = await this.UserIsAdm(nots[i].Editores[j].name)
                if(adm){
                    nots[i].Editores[j].permit = true
                }
                if(key === nots[i].Editores[j].name){
                    nots[i].Editores[j].permit = false
                }
            }
            await this.writeNoticiaData(nots[i])
        }
        FBDatabase.ref('Users/' + key).remove() 
    }
    // Pegando, salvando e deletando Tags
    static writeTagData = async(name) => {
        FBDatabase.ref('Tags').push({
            Nome: name,
            Q_N: 0
        })
    }
    static updateTagData = async(key, value) => { //value assume 1 ou -1
        if(key === ''){
            return
        }
        this.getTagData(key, (tag) =>{
            FBDatabase.ref('Tags/' + key).set({
                Nome: tag.Nome,
                Q_N: tag.Q_N + value
            })
        })
    }
    static getTagData = async (key, callback) =>{
        await FBDatabase.ref('Tags/'+key).once('value', dataSnapshot =>{
            let item = dataSnapshot.val();
            item['key'] = dataSnapshot.key;
            callback(item)
        })
    }
    static getAllTagData = async(callback) =>{
        await FBDatabase.ref('Tags').on('value', dataSnapshot => {
            let items = [];
            dataSnapshot.forEach(childSnapshot => {
                let item = childSnapshot.val();
                item['key'] = childSnapshot.key;
                item['checked'] = false;
                items.push(item);
            });
            callback(items);
        });
    }
    static deleteTag = async(key) =>{
        FBDatabase.ref('Tags/' + key).remove()
    }
    //Pegando, salvando e deletando Noticias
    static writeNoticiaData = async(noticia, callback) =>{
        if(noticia.id === undefined){
            let ref = FBDatabase.ref('Noticias').push({
                Autor: noticia.Autor,
                Editores: noticia.Editores,
                Resumo: noticia.Resumo,
                Titulo: noticia.Titulo,
                tags: noticia.tags,
                Data_Criacao: noticia.Data_Criacao,
                Ultima_Edicao: noticia.Ultima_Edicao
            })
            FBDatabase.ref('Conteudo/' + ref.key).set(noticia.Conteudo)
            if(noticia.Links !== undefined){
                FBDatabase.ref('Links/' + ref.key).set(noticia.Links)
            }
            callback(ref.key)
        }else{
            FBDatabase.ref('Noticias/' + noticia.id).set({
                Autor: noticia.Autor,
                Editores: noticia.Editores,
                Resumo: noticia.Resumo,
                Titulo: noticia.Titulo,
                tags: noticia.tags,
                Data_Criacao: noticia.Data_Criacao,
                Ultima_Edicao: noticia.Ultima_Edicao
            })
            FBDatabase.ref('Conteudo/' + noticia.id).set(noticia.Conteudo)
            if(noticia.Links !== undefined){
                FBDatabase.ref('Links/' + noticia.id).set(noticia.Links)
            }
            callback(noticia.id)
        }
        
    }
    static getAllNoticiaData = async(callback) =>{
        await FBDatabase.ref('Noticias').on('value', (dataSnapshot) =>{
            let items = [];
            dataSnapshot.forEach(childSnapshot=>{
                let item = childSnapshot.val();
                item['id'] = childSnapshot.key;
                item['flags'] = {extend: false};
                items.push(item)
            })
            callback(items)
        })
    }
    static getNoticiaData = async(id, callback) =>{
        let item
        await FBDatabase.ref('Noticias/'+id).once('value', dataSnapshot =>{
            item = dataSnapshot.val();
            item['id'] = dataSnapshot.key;
        })
        await FBDatabase.ref('Conteudo/' + item.id).once('value', conteudoSnapshot =>{
            item['Conteudo'] = conteudoSnapshot.val()
        })
        await FBDatabase.ref('Links/' + item.id).once('value', conteudoSnapshot =>{
            item['Links'] = conteudoSnapshot.val()
            if(item.Links === null){
                item.Links = []
            }
        })
        callback(item)
    }
    static deleteNoticia = async(id, tags) =>{
        for(let i in tags){
            this.updateTagData(tags[i], -1)
        }
        FBDatabase.ref('Noticias/' + id).remove()
        FBDatabase.ref('Conteudo/' + id).remove()
    }
};