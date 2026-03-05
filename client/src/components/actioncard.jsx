import { Link } from 'react-router-dom';

const ActionCard = ({ actionLabel, iconUrl, url }) => {
  return (
    <Link to={url} className="flex h-45 w-87.5 cursor-pointer flex-col items-center justify-center gap-2.5 rounded-lg border-[3px]! border-dashed! border-[#b0c4de]! bg-[#eaf0f6]! p-5 text-center font-semibold text-[#5a7a9e]">
      <div className="w-14 h-14 rounded-lg bg-white border-2 border-[#b0c4de] flex items-center justify-center">
        <img className="w-8 h-8" src={iconUrl} alt={`${actionLabel} icon`} />
      </div>
      <div className="text-[1rem] font-bold text-[#2d6cb5]">{actionLabel}</div>
    </Link>
  );
};

export default ActionCard;
