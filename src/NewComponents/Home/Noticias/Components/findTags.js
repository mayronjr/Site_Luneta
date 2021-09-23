
function findTags (cont, links_n, p, callback){
    let links = []
    if(p === 30){
        return
    }
    let parte_analisada
    if(p === 0){
        for(let i in links_n){
            links.push(links_n[i].tag)
        }
        parte_analisada = cont
    }else{
        links = links_n
        if(cont[0] === '<' && cont[cont.length-1] === '>' && cont[1] === cont[cont.length-2]){
            parte_analisada = cont.slice(3, cont.length-4)
        }else{
            parte_analisada = cont
        }
    }
    let parts = []
    let ponto_de_corte = [0, 0]
    let tag_identificada = ''
    for(let i in parte_analisada){
        if(parte_analisada[i-1] === '<' && parte_analisada[i-(-1)] === '>' && tag_identificada === parte_analisada[i] && ponto_de_corte[1] !== 0){
            break
        }
        if(parte_analisada[i-1] === '<' && parte_analisada[i-(-1)] === '>' && tag_identificada === ''){
            if(parte_analisada[i] === 'b' || parte_analisada[i] === 'i' || parte_analisada[i] === 'u'){
                tag_identificada = parte_analisada[i]
                ponto_de_corte[0] = i-1
            }
        }
        if(parte_analisada[i-1] === '<' && parte_analisada[i-(-2)] === '>' && tag_identificada === parte_analisada[i-(-1)]){
            ponto_de_corte[1] = i-(-3)
        }
    }
    let i
    if(tag_identificada === ''){
        let inicio = -1, fim = -1, tag
        for(i in links){
            inicio = parte_analisada.indexOf('<' + links[i] + '>')
            if(inicio !== -1){
                fim = parte_analisada.indexOf('</' + links[i] + '>')
                tag = links[i]
                break
            }
        }
        if(inicio !== -1){
            i = parte_analisada.slice(0, inicio)
            parts.push(i)
            i = parte_analisada.slice(inicio + ('<' + tag + '>').length, fim)
            parts.push({parts: i, tag: tag})
            i = parte_analisada.slice(fim + ('</' + tag + '>').length, parte_analisada.length)
            parts.push(i)
        }
        if(p === 0){
            parts.push(parte_analisada)
            callback(parts)
        }else{
            if(parts.length === 0){
                return parte_analisada
            }else{
                return parts
            }
        }
    }else if (ponto_de_corte[1] === 0){
        i = parte_analisada.slice(0, ponto_de_corte[0])
        parts.push(i)

        i = parte_analisada.slice(ponto_de_corte[0], cont.length) //Parte da tag
        i = findTags(i, links, p+1)
        parts.push({parts: i, tag: tag_identificada})
        return
    }else{

        i = parte_analisada.slice(0, ponto_de_corte[0])
        parts.push(i)

        i = parte_analisada.slice(ponto_de_corte[0], ponto_de_corte[1]) //Parte da tag
        i = findTags(i, links, p+1)
        parts.push({parts: i, tag: tag_identificada})

        i = parte_analisada.slice(ponto_de_corte[1], cont.length)
        i = findTags(i, links, p+1)
        parts.push(i)
    }
    if(p === 0){
        callback(parts)
    }else{
        return parts
    }
}

export default findTags