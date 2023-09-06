async function CreatePlayer(req, res){
    // req.body.email = req.body?.email || req.user?.email

    console.log(req.body, req.fileUrl)

    const { email , avatar , name, dob, location, role }  = req.body

    // await Player.create({
    //     email,
    //     name,
    //     dob,
    //     location,
    //     role
    // })

    res.json({ message: "New Player created", req: req.body })
    
}

module.exports = CreatePlayer