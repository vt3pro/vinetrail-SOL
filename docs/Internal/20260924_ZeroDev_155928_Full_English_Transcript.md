# Full English Transcript

- **Source:** `docs/Internal/assest/20260924_ZeroDev_155928_Export.MP3`
- **Duration:** 00:37:01 (2221.4s)
- **Model:** faster-whisper `medium`
- **Language:** en
- **Segments:** 409
- **Transcribed:** 2026-09-24T08:53:11.502880Z

---

[00:00:00] And click make unique this is going to create.

[00:00:04] A new material that is not linked to the rest of the scene.

[00:00:07] Where i can change the color so then i click the material to expand it.

[00:00:12] Go to the albio category and i'm going to click the color slot.

[00:00:16] And change the color to something like yellow.

[00:00:19] For example to make it a bit brighter so you can see that now.

[00:00:23] The material i could edit without changing the color of other.

[00:00:27] Platforms if i select my other platform that still has.

[00:00:32] The material shared with the main platforms if i go change the albedo.

[00:00:37] Color it's going to change in sync on every platform.

[00:00:42] Let's now see how to save materials to make them.

[00:00:45] Easier to edit anytime and also to reuse across game levels more easily.

[00:00:51] So select the bridge i'm going to select the one with the yellow.

[00:00:55] Material and in the inspector right click on the material and select.

[00:01:00] Save as this allows us to save the material as a file.

[00:01:05] That we can edit anytime from the file system doc.

[00:01:09] And reuse hello hello gm everyone hello hello.

[00:01:19] Let's just wait a few more minutes to give people some time to join.

[00:01:23] Yeah just two more minutes and then we can start.

[00:04:43] Okay i think we can start um well thank you so much.

[00:04:47] Everyone to be here uh welcome to another.

[00:04:50] Workshop for uh open house uh super excited for this one.

[00:04:56] And today and before we start just as a reminder to everyone if you.

[00:05:01] Have any questions if you have if you need any technical support.

[00:05:06] Don't forget that we have our open house channel on our discord.

[00:05:10] Our dev rel team is there our engineers team is there.

[00:05:14] So if you have any questions if you need any type of support or feedback.

[00:05:19] About something just feel free to drop your.

[00:05:22] Questions in the open house channel on our.

[00:05:25] Discord after this workshop right now we are.

[00:05:29] Going to have another workshop with gmx.

[00:05:34] And now today we are here with kunal of chain labs engineer and today.

[00:05:42] He's here to talk us about how to simplify.

[00:05:46] On chain ux with zero def so welcome kunal super excited to have.

[00:05:51] You here uh so take it away the floor yours.

[00:05:58] Hey everyone um i work at off-chain labs and i work.

[00:06:04] Specifically on zero def which is like a account abstraction.

[00:06:09] Kit uh embedded wallets pass keys session keys.

[00:06:16] Everything your app would need in production.

[00:06:19] To have users which are not uh like who actually super users so.

[00:06:25] I'll share my slideshow okay um.

[00:06:47] Okay yeah so yeah uh so i guess today we'll be looking at.

[00:06:53] Uh how we can make like a like on-chain application feel like more.

[00:06:59] Like a normal product so i want to like give like more of.

[00:07:05] An emphasis on like the user journey before we like talk of some of the.

[00:07:09] Infrastructure and i guess as you're like watching it.

[00:07:15] Keep in mind like how many times a user has to think about.

[00:07:20] A like a wallet b like gas c network and d like a transaction.

[00:07:28] Or like an approval um yeah so i i guess i i have also.

[00:07:37] Like a live demoish thing but i'll show that too.

[00:07:47] Uh sign out here so this is like r one of i realize i'm not sharing my.

[00:07:55] Whole thing all right yeah this is like some.

[00:08:10] Like this is like a very short demo i made.

[00:08:14] My last minute but um so you have like this is like showing like the.

[00:08:20] The passkey support we have for your app so you would have like some kind of.

[00:08:24] Register passkey and let's say let's use this.

[00:08:30] Now if it's a thing and i think we have to like.

[00:08:36] Mint some demo usdc which element on like the background.

[00:08:50] Reload this confirmation but this is actually on like the.

[00:08:58] Arbitra mainnet and this is basically you know.

[00:09:03] Step one is sort of like just deposit directly instead of you know.

[00:09:07] Creating a private key create funding your account.

[00:09:11] Instead of that let's say your app was some kind of like.

[00:09:14] Like autopilot or something which uh was like oh you deposit into this and.

[00:09:20] We sort of maintain a portfolio like some kind of.

[00:09:23] Ai agent maintains a portfolio think about all the.

[00:09:27] Times you need to approve the agent to send a.

[00:09:31] Transaction but instead we could have something.

[00:09:35] Like you have a passkey and then once you like deposit it.

[00:09:38] You sort of have this enable autopilot thing which.

[00:09:42] Uh let's say you know once you approve it.

[00:09:46] And now you like transfer some amount uh and the agent itself has like.

[00:09:51] Constraints and all of this is like on chain config so that you.

[00:09:57] Know like let's say some of ZeroDevs infra was.

[00:10:01] Compromised in that case you'll still be able to use.

[00:10:04] All of this like code is open source and all of it is also.

[00:10:09] Uh yeah and all of it is also like you can configure them one by one.

[00:10:16] So yeah just wanted to show the demo.

[00:10:25] Yeah and sort of like so they sign with like.

[00:10:29] They just like sign with the user with a passkey.

[00:10:32] Uh that once and that's it that's you complete it.

[00:10:36] So reason why i'm showing that is which yeah so i looked at this survey.

[00:10:44] Where uh so for every use so this survey basically showed that.

[00:10:53] That out of like a sample of 100 people landing on an application.

[00:10:57] Only 15 of them actually end up connecting a wallet.

[00:11:01] So you see like that friction and then off that 15.

[00:11:04] Only 45 percent of them make a first transaction right.

[00:11:08] So you have like this very poor like user.

[00:11:12] Conversion they're only like seven people out of the original.

[00:11:15] Hundred uh they end up making from actually didn't.

[00:11:20] Make up end up making interacting with your app right.

[00:11:23] So this kind of depends by product but i guess like the.

[00:11:27] Important part is like the number of steps the more number of steps you.

[00:11:31] Have the more the use of the stock so yeah they.

[00:11:34] Might need to like install a wallet they may need to.

[00:11:37] Like choose a network buy eat approvals.

[00:11:41] Confirmation deposit and then sort of wait for.

[00:11:45] Every approval so yeah it just gives them an.

[00:11:48] Another like chance to leave.

[00:11:54] So that was like that was the demo basically.

[00:11:58] Which was like uh you do like you have an authenticated wallet.

[00:12:03] And it asks the application to like deposit five usdc.

[00:12:08] And underneath the account does the real work.

[00:12:12] And it approves the sort of the usdc and deposits.

[00:12:16] Into the vault and this sort of the nice thing is they also can run.

[00:12:21] In like patches which mean that uh you don't have to.

[00:12:25] You don't have to wait for every transaction to land.

[00:12:28] And these calls so we have under the hood.

[00:12:32] Like a paymaster which covers the gas so the user does not need.

[00:12:37] Any eat in their wallet and all like the blockchain so this.

[00:12:43] Transaction which we showed this if you see.

[00:12:46] This is the a transaction and you see the logs.

[00:12:50] And they had a deployment and an approval of these and then had a.

[00:12:54] Transfer it's deposited so again like that's.

[00:12:58] Something like if you have some app in production you will not show them.

[00:13:02] Uh exploring but just for a demo.

[00:13:08] So and then yeah so i guess like i wanted to say like.

[00:13:14] Like a lot of like the wallet conversations which i've seen.

[00:13:18] From like externally they sort of focus just.

[00:13:21] On login like you know let's say can we allow users to sign in with.

[00:13:28] Passkeys emails you know all the sso stuff.

[00:13:32] So that is just the entry layer it answers.

[00:13:35] It kind of like it is useful in the way that.

[00:13:39] It sort of gets the user into the application.

[00:13:42] But then the account layer where what can the account do once the user is.

[00:13:48] Inside it's like the more important part.

[00:13:52] In my head because oh can it batch cause.

[00:13:56] Can it sponsor transactions can users delegate.

[00:14:00] A limited activity so it's uh so that is like a very important.

[00:14:06] Thing given that you know now a lot of these apps have like.

[00:14:10] Very granular like user or like permissions.

[00:14:14] So uh yeah and then can the app and can the account support like.

[00:14:20] Automations or like some kind of recovery and also.

[00:14:24] Are we handling unnecessary like chain boundaries right so uh if.

[00:14:31] You if you have used like some app like.

[00:14:33] Formal or something you would notice that it doesn't even.

[00:14:37] Tell you like what chain it is on right that is like.

[00:14:40] That has been a big like ui hurdle and that doesn't need to be um also.

[00:14:48] Like if i guess for production apps if.

[00:14:51] You already use providers like privy dynamic or any login providers.

[00:14:57] You can still use them we can we have like.

[00:15:00] Our our docs basically show how to like use that signer.

[00:15:04] While providing like these the things on the right hand side.

[00:15:08] Uh with our own product so um yeah then the next.

[00:15:15] Is yeah this is like what i was talking about for the permissions like.

[00:15:22] Uh imagine like a user gives this application.

[00:15:27] The permission where you eat the drops drop.

[00:15:30] Deposit five usdc into the strategy world.

[00:15:33] Never more than 10 usdc in total only into this world at this hour and.

[00:15:39] Stop tomorrow so uh.

[00:15:44] Yeah so it's this is like so would you like i guess like.

[00:15:50] If you had like this kind of intent you won't give this application your.

[00:15:54] Private key because it might have other things.

[00:15:58] So uh but would you also then every time come to the application.

[00:16:02] To approve every five usd deposit manually right.

[00:16:07] Uh you probably won't do that so we have like.

[00:16:10] This very narrow authority which we need.

[00:16:13] Um it should be so it should be able to perform this one useful action.

[00:16:18] Under this very specific limits which the users choose.

[00:16:22] And this is what our like kernel wallets give us.

[00:16:26] This limited access um.

[00:16:31] So okay let's like how do how would you like define this.

[00:16:37] Define this permission right the first one is sort of the asset.

[00:16:40] Which is simple it's like you give it the address.

[00:16:43] And let's say up in our example we have usdc.

[00:16:48] Right and then i guess the next one would be destination your two address.

[00:16:52] Which is another permission like another limit.

[00:16:56] And and if you interact you it basically is like a allow list which.

[00:17:01] Allows you to interact with this specific word.

[00:17:04] And no other and then uh and then the third one is.

[00:17:11] This specific function so let's say you can do a deposit.

[00:17:14] But it can't call any withdrawals for example.

[00:17:18] And then how much would you be able to want to transfer that is your next.

[00:17:21] Max run these are all the configurable limits.

[00:17:25] In the wallet contract itself like the kernel contract.

[00:17:29] And let's say we set that to five usdc.

[00:17:32] Total allowance is 20 usdc can run once an hour and then yeah it can be.

[00:17:39] Approved until tomorrow so uh.

[00:17:45] Behind all these approvals what the agent does.

[00:17:49] Or like what we do is like give it a session key to the agent.

[00:17:52] And it has its own like address and this.

[00:17:57] Uh this is like a very scoped out session key.

[00:18:01] From the actual account itself and then uh yeah so i guess i i had this.

[00:18:09] I have like a like a mock demo of what it would look like.

[00:18:15] In this uh let's say let's say this how it would look like in your.

[00:18:20] Let's say you know you deposit five usdc enable autopilot.

[00:18:24] And then let's say you deposit more then it was allowed and this was.

[00:18:30] Rejected and then you have unauthorized which.

[00:18:33] Is unsafe and then you have like a let's say you.

[00:18:38] Know like the agent was monitoring the price and.

[00:18:42] Your price is dropped and now your autopilot can act again.

[00:18:46] Invested more and now your recovery guardian is ready.

[00:18:51] So you recovered back in your safe hands.

[00:18:54] Original order okay so yeah so yeah i guess these were like some of.

[00:19:05] The mock demo uh steps where you tried to like.

[00:19:10] Request 100 usdc which was which we shouldn't have.

[00:19:14] Gone through or it won't go through and then.

[00:19:18] Let's say uh so this is all rejected at like a contract level.

[00:19:25] Which means that you don't even need once the contract is deployed.

[00:19:29] And once you've said it you can just use your direct your normal.

[00:19:33] Vm or any of the other libraries which will just show like contract error.

[00:19:39] Um so it basically just fails before simulation.

[00:19:43] But we have our own stk2 which has you know like a.

[00:19:47] Properly sanitized errors and stuff and uh the permission only allows five so.

[00:19:54] The world position keeps remains unchanged and.

[00:19:58] Then the check does not depend on having like the agent.

[00:20:03] Or like having like a compromise agent put it like the same limit.

[00:20:08] So uh let's do next one so this was like the other.

[00:20:13] Deposit where uh the permissions and the functions.

[00:20:17] Weren't in the contract in the.

[00:20:20] Permissions itself and next one so you have this uh so.

[00:20:27] This would is i kind of like simulate in my.

[00:20:30] Head what an agent would do let's say you know like you have.

[00:20:34] Like some kind of a rules match whatever is trying to monitor it.

[00:20:38] Prepares a deposit and it checks against the permission contract is.

[00:20:42] Correct function is correct amount is within limit time window is.

[00:20:46] Valid agent submits an operation without.

[00:20:49] Asking for a user approval and uh because we have.

[00:20:55] In our dashboard we have sponsored gas we allow.

[00:20:58] Users or we allow the agent to pay the gas.

[00:21:03] Uh so yeah and this is the recovery setting.

[00:21:11] So you sort of like um you sort of assume like the user like.

[00:21:17] Loses your their passkey and then you have.

[00:21:21] You know you're trying to recover it and we can you can set like a guardian.

[00:21:26] Which the users can configure or like as.

[00:21:29] App you can configure for the user and then.

[00:21:33] The guardian would review this the recovery request and approve like a.

[00:21:39] Replacement signer and yeah so now you basically.

[00:21:47] Uh you have like the signer once you sort of have recovered the.

[00:21:54] Smart account address still remains unchanged.

[00:21:57] Which means that your your same account would have that usd basa usdc.

[00:22:02] Balance and that wall position was also be.

[00:22:05] Unchanged uh so that is a nice way.

[00:22:11] And let's show maybe yeah let's show like sort of like what.

[00:22:15] The users saw and what like we have under the hood.

[00:22:19] Uh so so when like the user signed with the passkey.

[00:22:24] The passkey is controlled by a signer on a kernel smart account kernel is.

[00:22:30] Like our smart account architecture name uh when the.

[00:22:34] Users staff deposit the account batches all the approvals.

[00:22:39] And the deposits into one atomic transaction.

[00:22:42] And when the users have have no eat you have like a paymaster which you.

[00:22:48] Can support in our dashboard which allows so you can have like.

[00:22:52] This i'll show this uh where is the dashboard okay so.

[00:22:57] You have these gas policies and you can select for your chain if you.

[00:23:02] Want to sponsor all transactions or you want to have a chain policy.

[00:23:05] A contract policy and a wallet policy uh so in this case we would have like.

[00:23:12] Some kind of a wallet policy where we add the wallet here.

[00:23:16] Uh so that's the dashboard and then like sort of and then like.

[00:23:23] The users enable autopilot we sort of have like this scope.

[00:23:27] Permission for the agent session key and when they require back.

[00:23:31] Policies the kernel's policy validation.

[00:23:34] Rejects them and when the users lose their passkey the guardian which is.

[00:23:40] Authorized either by your app or by the users.

[00:23:43] Themselves uh authorizes like the recovery action.

[00:23:48] Um so yeah this is like how all of these.

[00:23:51] Pieces are together and this is how they sort of fit together where uh.

[00:23:58] Our main thing is the smart contract or like the Kernel accounts.

[00:24:02] Uh let's go to a little more in depth um.

[00:24:10] The i guess i also like didn't want to go over like the actual like.

[00:24:14] Account extraction stack because most people are familiar in this call.

[00:24:19] Um but also like you can just read about it online.

[00:24:24] Um so yeah i guess the first one is like uh yeah you just have you just want.

[00:24:33] To show how simple it is to batch transactions.

[00:24:36] Um so you have one you in your case on the ui you would have.

[00:24:42] One deposit button and you would have these two batch.

[00:24:45] Transactions on the left and then uh they also like.

[00:24:50] Execute atomically so they either execute both.

[00:24:53] Or not so that way um in case like you know the users approve and the deposit.

[00:24:59] Somehow fails both of them would fail you would not.

[00:25:02] Have a user with a like sort of like a hanging approval.

[00:25:06] Um so and then once you have like this create permission.

[00:25:11] Uh this sort of restricts whatever the contract and the function is.

[00:25:17] And then you have like the rate limit and everything.

[00:25:21] And yeah is the actual like documentation has the exact api's and.

[00:25:27] Everything so you'd have more complete examples.

[00:25:29] There too but yeah wanted to show this.

[00:25:38] Yeah so um so yeah these are like the sort of like the table states.

[00:25:43] Where you have like uh sponsorship and then you would.

[00:25:47] Have uh some kind of like.

[00:25:52] Atomic batching and then you would have some kind of subscriptions you would.

[00:25:56] Have limit orders you would have agents and those are.

[00:25:59] All the things you could sort of do um and all of these patents everyone.

[00:26:05] Has like a recovery path um like our kernel wallets has.

[00:26:09] Been in production for like two three years.

[00:26:11] So we have seen a lot of you know edge cases so we have a lot of like.

[00:26:16] Surface area for recovery so yeah you can use it for like some.

[00:26:20] Kind of like recurring deposits subscriptions.

[00:26:24] Etc etc.

[00:26:28] Anyway you sort of think about like you know the account.

[00:26:31] May outlive its original credential and also i wanted to share smart.

[00:26:40] Routing addresses uh which is like smart routing.

[00:26:46] Addresses are more like deposit addresses.

[00:26:48] Where um you know like say your user is on other chain.

[00:26:53] And you want to reach on like say arbitrum and their funds are on base.

[00:26:57] Something right so they still need to get that assets.

[00:27:01] Into the application so what we do is uh you call the.

[00:27:05] API it creates a deposit address on base.

[00:27:08] And has a sort of like already configured action set.

[00:27:13] So we give you an address we give the user an address on base.

[00:27:17] They sort of just send it there and behind the scenes.

[00:27:21] We'll bridge it for you and after bridging we'll uh.

[00:27:25] Let's say you have some kind of a configured action set let's say you.

[00:27:28] Want like the user's usdc to be deposited to.

[00:27:31] Like let's say a morph of word or something to.

[00:27:34] On some yield on the background that is you can just.

[00:27:37] Configure it um so yeah this basically allows.

[00:27:43] That you have you're meeting the users where they are.

[00:27:49] And then also it's like secure enough where.

[00:27:52] It's not like some kind of unbounded space where you have like these two.

[00:27:55] Different things they can do and then you know somehow it gets.

[00:27:58] Lost uh because in in case let's say.

[00:28:02] The transaction doesn't go through it gets refunded.

[00:28:06] Either on the source chain or the destination chain whichever way wherever.

[00:28:09] You want uh so yeah.

[00:28:14] Uh we have our demo for that too.

[00:28:21] I'll just post that later but um it just the demo shows like how to how.

[00:28:27] Would you create an address and then uh like a deposit and also like.

[00:28:33] Because like bridging is not like there's some fee to the bridging.

[00:28:37] Let's say you know 10 cents or something.

[00:28:39] We sort of restrict how much amount we have so we have like a minimum.

[00:28:43] Deposit amount and that way you know the users.

[00:28:47] Don't have an insane like slippage.

[00:28:51] Um and then i guess yeah this is just.

[00:28:56] This is like the QR code for the docs.

[00:28:59] Or you can just go to docs.ZeroDev.app uh.

[00:29:03] Yeah just think about any product you're building and think about you.

[00:29:07] Know like the most annoying set of actions you're.

[00:29:11] Having the users take which is like you know several transactions.

[00:29:16] Um yeah turn all of that into like sort of just one.

[00:29:20] User intent and yeah and then you sort of also.

[00:29:27] Don't have unrestricted control.

[00:29:32] Uh or you if you're like if your app has like some kind of like automation or.

[00:29:37] Something then yeah then so you can like sort of.

[00:29:40] Define the permissions and in a very like.

[00:29:45] In using our SDK basically so yeah you can uh i guess in the docs.

[00:29:55] There will be like a bullet quick start and stuff too so.

[00:30:03] Yeah you'll have um quick start here then you would have onboarding.

[00:30:10] Then you have smart account and onramp has the smart.

[00:30:14] Uh routing address and i think this is the portal.

[00:30:20] So you can sort of use whatever your address is.

[00:30:23] Chain uh let's say you want to go to solana and.

[00:30:31] The program and then yeah you have support.

[00:30:35] Native tokens too so yeah this sort of generates like a.

[00:30:39] Smart routing address um yeah i guess i am happy to answer any.

[00:30:51] Questions i know like the demo was pretty.

[00:30:53] Short but yeah pretty short but pretty.

[00:30:58] Packed with information um very good one.

[00:31:03] So yeah let's open the floor for a few questions if anyone.

[00:31:06] Wants to ask something just feel free to raise your hand or just drop your.

[00:31:10] Questions here in the chat we already have one uh from.

[00:31:14] Lab siloed vine uh here in the chat uh kunal if you don't mind answering it.

[00:31:20] So love the autopilot request slide as we build agentic workflows on zero.

[00:31:26] Dev what is your recommended pattern for.

[00:31:30] Layering dynamic market dependent guardrails like oracle lab or.

[00:31:36] Order book depth checks on top of ZeroDev static.

[00:31:40] Permissions yeah so actually our latest like uh.

[00:31:46] Latest kernel wallets they allow you to define your own like.

[00:31:50] Condition it has like uh it has like this uh extendable.

[00:31:56] Interface where it allows you to like have defined some.

[00:31:59] Uh condition which allows which has like a.

[00:32:02] Boolean true or false so within that condition you would have like some kind.

[00:32:06] Of like you know uh some kind of like oracle like.

[00:32:11] You know what is a chain link oracle bitcoin.

[00:32:14] Price less than 80k or something that could have your if it returns true.

[00:32:19] Will allow it if it doesn't return proof will.

[00:32:22] Not allow it so it checks in real time.

[00:32:28] This is this will be on the kernel before which um.

[00:32:33] Which we have the contracts and everything deployed but i don't know i.

[00:32:36] Think you might need like a beta stk or something i hope that answers your.

[00:32:53] Question uh silver vine uh does anyone have.

[00:32:57] Any more uh questions once again feel free to drop them here in the chat.

[00:33:01] Or raise your hand uh also don't forget that we have our.

[00:33:06] Discord channel um with the open house channel uh our.

[00:33:10] Engineers team is there our dev rel team is there so if you have any.

[00:33:14] Questions if you need support um just feel free to.

[00:33:18] Drop your questions there and our team will answer your.

[00:33:22] Questions as best as possible yeah exactly so kunal is going to.

[00:33:42] Drop the slides for this presentation uh on our open house channel on.

[00:33:47] Discord so if you want to take a look at it.

[00:33:50] Again and review it more carefully just go to the open house to check the.

[00:33:55] Slides okay we have another question here.

[00:34:00] Kunal from you list davy um we have a mobile app producing.

[00:34:07] Signed compute proofs and an arbitrum registry anchoring those proofs could.

[00:34:13] ZeroDev let us give the app an hourly scope.

[00:34:17] Permission to sponsor and submit registry transactions.

[00:34:21] Without asking the user to sign every proof.

[00:34:25] Um i we have like a mobile we have mobile app support so that would.

[00:34:32] Work but um i would need to see how the sign transit like the signed.

[00:34:40] Compute proofs are like verified on chain.

[00:34:46] To know exactly for sure but i would think this is possible yeah but uh.

[00:34:58] If you have like a bit more detail i can answer it on the discord too.

[00:35:03] So yeah perfect does anyone have any more uh questions once again feel.

[00:35:23] Free to drop them here in the chat okay i don't think anyone has any.

[00:35:43] More questions which is a good sign um so.

[00:35:47] Yeah once again as a reminder guys um don't forget that we have our open.

[00:35:52] House channel on our discord kunal is gonna drop his slides.

[00:35:57] There so if anyone wants to review the the slides once again just go to.

[00:36:02] The open house channel and check it out.

[00:36:04] Uh if you have any more questions once again feel free to drop them in the.

[00:36:08] Open house channel for our dev rel team and engineers team.

[00:36:12] And yeah once again thank you so much for being here.

[00:36:16] Don't forget that we are going to have another workshop.

[00:36:19] Following this one with gmx which starts if i'm not mistaken in 25.

[00:36:26] Minutes from now so feel free to join that workshop.

[00:36:31] It's a very good one and yeah once again thank you so much for being.

[00:36:34] Here i'm going to give you back 10 minutes.

[00:36:37] Uh and hope to see you in the next one.

[00:36:40] And let's keep building thank you everyone.

[00:36:45] Thanks for attending everyone.
