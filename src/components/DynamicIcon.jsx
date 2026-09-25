import * as IonIcons from 'react-icons/io5';

const DynamicIcon = ({name, className}) => {
  const {...icons} = IonIcons;
    const TheIcon = icons[name];
    return(
        <TheIcon className={className}/>
    )
}

export default DynamicIcon
