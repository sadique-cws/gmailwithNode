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
    var inboxMail = await MailModels.find({recieverId:sessionId}).populate("senderId")
    return res.render("inbox",{"mails":inboxMail,"countInbox":countInbox,"countOutbox":countOutbox,"countTrash":countTrash,"countDraft":countDraft})
   
}
async function OutBox(req,res){
    sessionId = req.session.user;
    [countInbox,countOutbox,countTrash,countDraft] = await CountData(req,res);
    var inboxMail = await MailModels.find({senderId:sessionId}).populate("recieverId")
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

async function compose(req,res){
    recieverData = await AccountModels.findOne({email:req.body.to})
    senderId = req.session.user;
    console.log(senderId);

    var mailInsert = new MailModels({
        senderId: senderId,
        recieverId : recieverData._id,
        subject :  req.body.subject,
        content : req.body.content,
        status: 1,
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

}