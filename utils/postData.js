async function postData(req){
    return new Promise((resolve, reject) => {
        try {
            let body = ""
            req.on("data", (chunck) => {
                body += chunck.toString()
            })

            req.on("end", async () => {                  
                resolve(body)
            })
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    postData
}