var Sync = {
    loadProgrammes: function () {
        return db.collection('app').doc('programmes').get().then(function (d) {
            var list = d.exists && d.data().list ? d.data().list : [];
            localStorage.setItem('programmes', JSON.stringify(list));
            return list;
        }).catch(function () {
            return JSON.parse(localStorage.getItem('programmes') || '[]');
        });
    },
    saveProgrammes: function (list) {
        localStorage.setItem('programmes', JSON.stringify(list));
        return db.collection('app').doc('programmes').set({ list: list });
    },
    loadPresent: function () {
        return db.collection('app').doc('present').get().then(function (d) {
            var map = d.exists && d.data().map ? d.data().map : {};
            localStorage.setItem('present', JSON.stringify(map));
            return map;
        }).catch(function () {
            return JSON.parse(localStorage.getItem('present') || '{}');
        });
    },
    savePresent: function (map) {
        localStorage.setItem('present', JSON.stringify(map));
        return db.collection('app').doc('present').set({ map: map });
    },
    loadOverall: function () {
        return db.collection('app').doc('overall').get().then(function (d) {
            var map = d.exists && d.data().map ? d.data().map : {};
            localStorage.setItem('overall', JSON.stringify(map));
            return map;
        }).catch(function () {
            return JSON.parse(localStorage.getItem('overall') || '{}');
        });
    },
    saveOverall: function (map) {
        localStorage.setItem('overall', JSON.stringify(map));
        return db.collection('app').doc('overall').set({ map: map });
    },
    loadAllMarks: function () {
        return db.collection('marks').get().then(function (snap) {
            var jobs = [];
            var out = {};
            snap.forEach(function (doc) {
                jobs.push(db.collection('marks').doc(doc.id).collection('judges').get().then(function (jSnap) {
                    var judges = {};
                    jSnap.forEach(function (j) { judges[j.id] = j.data(); });
                    out[doc.id] = judges;
                }));
            });
            return Promise.all(jobs).then(function () {
                localStorage.setItem('marks', JSON.stringify(out));
                return out;
            });
        }).catch(function () {
            return JSON.parse(localStorage.getItem('marks') || '{}');
        });
    },
    saveJudgeMarks: function (progName, email, lettersObj) {
        return db.collection('marks').doc(progName).collection('judges').doc(email)
            .set(lettersObj, { merge: true })
            .then(function () {
                return db.collection('marks').doc(progName).set({ _t: firebase.firestore.FieldValue.serverTimestamp() }, { merge: true });
            });
    },
    saveJudgeMarksFull: function (progName, email, lettersObj) {
        return db.collection('marks').doc(progName).collection('judges').doc(email)
            .set(lettersObj)
            .then(function () {
                return db.collection('marks').doc(progName).set({ _t: firebase.firestore.FieldValue.serverTimestamp() }, { merge: true });
            });
    },
    deleteJudgeMarks: function (progName, email) {
        return db.collection('marks').doc(progName).collection('judges').doc(email).delete();
    },
    deleteProgrammeMarks: function (progName) {
        return db.collection('marks').doc(progName).collection('judges').get().then(function (snap) {
            var jobs = [];
            snap.forEach(function (j) { jobs.push(j.ref.delete()); });
            return Promise.all(jobs).then(function () {
                return db.collection('marks').doc(progName).delete();
            });
        });
    },
    listenMarks: function (cb) {
        return db.collection('marks').onSnapshot(function (snap) {
            var jobs = [];
            var out = {};
            snap.forEach(function (doc) {
                jobs.push(db.collection('marks').doc(doc.id).collection('judges').get().then(function (jSnap) {
                    var judges = {};
                    jSnap.forEach(function (j) { judges[j.id] = j.data(); });
                    out[doc.id] = judges;
                }));
            });
            Promise.all(jobs).then(function () {
                localStorage.setItem('marks', JSON.stringify(out));
                cb(out);
            });
        });
    },
    listenProgrammes: function (cb) {
        return db.collection('app').doc('programmes').onSnapshot(function (d) {
            var list = d.exists && d.data().list ? d.data().list : [];
            localStorage.setItem('programmes', JSON.stringify(list));
            cb(list);
        });
    },
    listenPresent: function (cb) {
        return db.collection('app').doc('present').onSnapshot(function (d) {
            var map = d.exists && d.data().map ? d.data().map : {};
            localStorage.setItem('present', JSON.stringify(map));
            cb(map);
        });
    },
    listenOverall: function (cb) {
        return db.collection('app').doc('overall').onSnapshot(function (d) {
            var map = d.exists && d.data().map ? d.data().map : {};
            localStorage.setItem('overall', JSON.stringify(map));
            cb(map);
        });
    }
};