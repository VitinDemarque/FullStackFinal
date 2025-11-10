import { useLocation, useNavigate } from "react-router-dom";
import {
  FaComments,
  FaHome,
  FaCode,
  FaTrophy,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaUsers,
} from "react-icons/fa";
import { useAuth } from "@contexts/AuthContext";
import { resolvePublicUrl } from "@/services/api";
import * as S from "@/styles/components/Sidebar/styles";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const menuItems = [
    { path: "/dashboard", icon: FaHome, label: "Dashboard" },
    { path: "/desafios", icon: FaCode, label: "Desafios" },
    { path: "/foruns", icon: FaComments, label: "Fóruns" },
    { path: "/grupos", icon: FaUsers, label: "Grupos" },
    { path: "/ranking", icon: FaTrophy, label: "Ranking" },
    { path: "/profile", icon: FaUser, label: "Perfil" },
    { path: "/configuracoes", icon: FaCog, label: "Configurações" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <S.SidebarContainer>
      <S.SidebarHeader>
        <S.Logo to="/dashboard">
          <S.LogoBracket>{"{"}</S.LogoBracket>
          <S.LogoText>DevQuest</S.LogoText>
          <S.LogoBracket>{"}"}</S.LogoBracket>
        </S.Logo>
      </S.SidebarHeader>

      <S.UserInfo onClick={() => navigate("/profile")}>
        <S.UserAvatar>
          {user?.avatarUrl ? (
            <S.UserAvatarImage src={resolvePublicUrl(user.avatarUrl)!} alt={user.name} />
          ) : (
            <FaUser />
          )}
        </S.UserAvatar>
        <S.UserDetails>
          <S.UserName>{user?.name || "Usuário"}</S.UserName>
          <S.UserLevel>Level {user?.level || 1}</S.UserLevel>
        </S.UserDetails>
      </S.UserInfo>

      <S.Navigation>
        <S.NavList>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <li key={item.path}>
                <S.NavItem to={item.path} $isActive={isActive}>
                  <Icon />
                  <span>{item.label}</span>
                </S.NavItem>
              </li>
            );
          })}
        </S.NavList>
      </S.Navigation>

      <S.LogoutButton onClick={handleLogout}>
        <FaSignOutAlt />
        <span>Sair</span>
      </S.LogoutButton>
    </S.SidebarContainer>
  );
}
