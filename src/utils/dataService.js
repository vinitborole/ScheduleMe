import firebase from '../firebase';

const db = firebase.ref('/tutorials');

class TutorialDataService {
  getAll = () => db;

  create = (tutorial) => db.push(tutorial);

  update = (key, value) => db.child(key).update(value);

  delete = (key) => db.child(key).remove();

  deleteAll = () => db.remove();

  deleteSelected = (keys) => db.update(keys);
}

export default new TutorialDataService();
