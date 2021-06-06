import PropTypes from 'prop-types';
import Header from './Header';

export default function Page({ children }) {
  return (
    <div>
      <Header />
      <h2>I am the Page component</h2>
      {children}
    </div>
  );
}

Page.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node),
};
