const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.like = functions.https.onCall(async (data, context) => {
	if (!context.auth) {
		throw new Error("Unauthorized");
	}
	if (!data) {
		throw new Error("Pet ID is required");
	}
	if (!data.petId) {
		throw new Error("Pet ID is required");
	}
	let pet = await admin.firestore().collection("pets").doc(data.petId).get();
	if (!pet.exists) {
		throw new Error("Pet does not exist");
	}
	let ref = admin.firestore().collection("pets").doc(data.petId).collection("likes").doc(context.auth.uid);
	let like = await ref.get();
	if (like.exists) {
		console.log(like.data());
		return { success: like.data().timestamp._seconds };
	} else {
		let timestamp = new Date();
		await ref.set({ timestamp: timestamp });
		return { success: timestamp.getSeconds() };
	}
});

exports.dislike = functions.https.onCall(async (data, context) => {
	if (!context.auth) {
		throw new Error("Unauthorized");
	}
	if (!data) {
		throw new Error("Pet ID is required");
	}
	if (!data.petId) {
		throw new Error("Pet ID is required");
	}
	let pet = await admin.firestore().collection("pets").doc(data.petId).get();
	if (!pet.exists) {
		throw new Error("Pet does not exist");
	}
	let ref = admin.firestore().collection("pets").doc(data.petId).collection("likes").doc(context.auth.uid);
	let like = await ref.get();
	if (like.exists) {
		await ref.delete();
		return { success: "Deleted" };
	} else {
		return { error: "Like does not exist" };
	}
});

exports.fakeData = functions.https.onRequest((req, res) => {
	admin
		.firestore()
		.collection("pets")
		.add({
			name: "Arnold",
			type: "dog",
			owner: "user1",
			image: "n02104029_3493",
			location: {
				town: "Praha",
				country: "cz",
			},
		})
		.then((r) => undefined);
	admin
		.firestore()
		.collection("pets")
		.add({
			name: "Batman",
			type: "cat",
			owner: "user2",
			image: "n02104365_8706",
			location: {
				town: "Praha",
				country: "cz",
			},
		})
		.then((r) => undefined);
	admin
		.firestore()
		.collection("pets")
		.add({
			name: "TukTuk",
			type: "bird",
			owner: "user4",
			image: "n02104029_3493",
			location: {
				town: "Praha",
				country: "cz",
			},
		})
		.then((r) => undefined);
	res.sendStatus(200);
});

exports.addPet = functions.https.onCall(async (data, context) => {
	if (context.auth === null) return;
	pet.owner = context.auth.uid;
	let pet = await admin.firestore().collection("pets").add(data);
	return pet.id;
});

exports.getPetCount = functions.https.onCall(async (data, context) => {
	if (context.auth === null) return;
	let uid = data.id;
	let res = await admin.firestore().collection("pets").where("owner", "==", uid).get();
	return res.size;
});
exports.getLikeCount = functions.https.onCall(async (data, context) => {
	if (context.auth === null) return;
	let id = data.id;
	let res = await admin.firestore().collection("pets").doc(id).collection("likes").get();
	return res.size;
});
exports.getReviewsStat = functions.https.onCall(async (data, context) => {
	if (context.auth === null) return;
	let id = data.id;
	let res = await admin.firestore().collection("pets").doc(id).collection('reviews').get();
	let avg = 0;
	res.forEach((i) => avg += i.rating)
	if(res.size === 0) return {count: 0, avg: '?'}
	return {count: res.size, avg: avg / res.size};
});
