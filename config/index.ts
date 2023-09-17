import development from '../config/development';
import production from '../config/production';

const NODE_ENV = process.env.NODE_ENV || 'development';

export default NODE_ENV === 'development' ? development : production;