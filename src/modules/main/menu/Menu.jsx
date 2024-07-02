import { Link } from "react-router-dom";

const Menu = (props) => {

  const { Id, Name, Icon, Title, Parents } = props;

  const hidemenu = () => {
    props.hideMenu(Parents, Id);
  }

  return (
    <Link key={Id} to={Name} className="link cursor-pointer"
      onClick={e => { hidemenu(); }}>
      <span className={Icon} />{Title}
    </Link>
  );
}

export default Menu;
