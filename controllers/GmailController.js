const AccountModels = require("../models/AccountsModel");
const MailModels = require("../models/MailModels");

async function CountData(req,res){
    sessionId = req.session.user;
    var countInbox = await MailModels.countDocuments({recieverId:sessionId,status:1})
    var countOutbox = await MailModels.countDocuments({senderId:sessionId,status:1})
    var countTrash = await MailModels.countDocuments({$or:[{senderId:sessionId},{recieverId:sessionId}],status:-1})
    var countDraft = await MailModels.countDocuments({senderId:sessionId,status:0}) 

    return [countInbox,countOutbox,countTrash,countDraft];
}

async function Inbox(req,res){
    sessionId = req.session.user;
    [countInbox,countOutbox,countTrash,countDraft] = await CountData(req,res);
    var inboxMail = await MailModels.find({recieverId:sessionId,status:1}).populate("senderId")
    return res.render("inbox",{"mails":inboxMail,"countInbox":countInbox,"countOutbox":countOutbox,"countTrash":countTrash,"countDraft":countDraft})
   
}
async function AllMail(req,res){
    sessionId = req.session.user;
    [countInbox,countOutbox,countTrash,countDraft] = await CountData(req,res);
    var allMail = await MailModels.find({$or:[{recieverId:sessionId},{senderId:sessionId}]}).populate("senderId")
    return res.render("allmail",{"mails":allMail,"countInbox":countInbox,"countOutbox":countOutbox,"countTrash":countTrash,"countDraft":countDraft})
   
}
async function OutBox(req,res){
    sessionId = req.session.user;
    [countInbox,countOutbox,countTrash,countDraft] = await CountData(req,res);
    var inboxMail = await MailModels.find({senderId:sessionId,status:1}).populate("recieverId")
    return res.render("outbox",{"mails":inboxMail,"countInbox":countInbox,"countOutbox":countOutbox,"countTrash":countTrash,"countDraft":countDraft})
}
async function draft(req,res){
    sessionId = req.session.user;
    [countInbox,countOutbox,countTrash,countDraft] = await CountData(req,res);
    var inboxMail = await MailModels.find({senderId:sessionId,status:0}).populate("recieverId")
    return res.render("draft",{"mails":inboxMail,"countInbox":countInbox,"countOutbox":countOutbox,"countTrash":countTrash,"countDraft":countDraft})
}
async function trash(req,res){
    sessionId = req.session.user;
    [countInbox,countOutbox,countTrash,countDraft] = await CountData(req,res);
    var inboxMail = await MailModels.find({$or:[{senderId:sessionId},{recieverId:sessionId}],status:-1}).populate("recieverId").populate("senderId")
    return res.render("trash",{"mails":inboxMail,"countInbox":countInbox,"countOutbox":countOutbox,"countTrash":countTrash,"countDraft":countDraft})
}

async function viewMail(req,res){
    var id = req.params.id;
    [countInbox,countOutbox,countTrash,countDraft] = await CountData(req,res);
    var singleMail = await MailModels.findById(id).populate("senderId").populate("recieverId");
    return res.render("view",{"mail":singleMail,"countInbox":countInbox,"countOutbox":countOutbox,"countTrash":countTrash,"countDraft":countDraft});
}
async function moveToTrash(req,res){
    var id = req.params.id;
    await MailModels.findOneAndUpdate({_id:id},{status:-1}).exec(function(error,response){
        if(error){
            return error;
        }
       else{
            return res.redirect("/trash");
       }
    });
}
async function undoFromTrash(req,res){
    var id = req.params.id;
    var mailRecord = await MailModels.findById(id);
    var status = 1;
    if(mailRecord.lastStatus == 0){
        status  = mailRecord.lastStatus;
    }
    
    await MailModels.findOneAndUpdate({_id:id},{status:status}).exec(function(error,response){
        if(error){
            return error;
        }
       else{
            return res.redirect("/inbox");
       }
    });
}
async function deleteFromTrash(req,res){
    var id = req.params.id;
    await MailModels.findOneAndDelete({_id:id}).exec(function(error,response){
        if(error){
            return error;
        }
       else{
            return res.redirect("/inbox");
       }
    });
}
async function sendFromDraft(req,res){
    var id = req.params.id;
    await MailModels.findOneAndUpdate({_id:id},{status:1}).exec(function(error,response){
        if(error){
            return error;
        }
       else{
            return res.redirect("/inbox");
       }
    });
}

async function compose(req,res){
    recieverData = await AccountModels.findOne({email:req.body.to})
    senderId = req.session.user;
    file = req.file.filename;
    console.log(senderId);
    var status;

    if(req.body.save){
        lastStatus = status = 0;
        
    }
    else{
        lastStatus = status = 1;
    }

    var mailInsert = new MailModels({
        senderId: senderId,
        recieverId : recieverData._id,
        subject :  req.body.subject,
        content : req.body.content,
        status: status,
        lastStatus: lastStatus,
        attachment : file,
        date: new Date(),
    });

    mailInsert.save();

    res.redirect("/inbox");
}


module.exports = {
    Inbox,
    compose,
    OutBox,
    draft,
    trash,
    viewMail,
    moveToTrash,
    undoFromTrash,
    deleteFromTrash,
    AllMail,
    sendFromDraft,

}