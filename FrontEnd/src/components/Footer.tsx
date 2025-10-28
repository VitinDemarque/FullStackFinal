import {
  FaFacebook,
  FaGithub,
  FaYoutube,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import * as S from "@/styles/components/Footer/styles";

export default function Footer() {
  return (
    <S.FooterContainer>
      <S.FooterContent>
        <S.LogoSection>
          <S.LogoTitle>
            <S.LogoBracket>{"{"}</S.LogoBracket>
            DevQuest
            <S.LogoBracket>{"}"}</S.LogoBracket>
          </S.LogoTitle>
          <S.LogoDescription>
            Transforme seu aprendizado em código com desafios práticos,
            gamificação e uma comunidade apaixonada por programação.
          </S.LogoDescription>
        </S.LogoSection>

        <S.LinksGrid>
          <S.LinkColumn>
            <S.ColumnTitle>Plataforma</S.ColumnTitle>
            <S.LinkList>
              <S.LinkItem>
                <S.FooterLink to="/desafios">Desafios</S.FooterLink>
              </S.LinkItem>
              <S.LinkItem>
                <S.FooterLink to="/ranking">Ranking</S.FooterLink>
              </S.LinkItem>
              <S.LinkItem>
                <S.FooterLink to="/badges">Badges</S.FooterLink>
              </S.LinkItem>
              <S.LinkItem>
                <S.FooterLink to="/grupos">Grupos</S.FooterLink>
              </S.LinkItem>
            </S.LinkList>
          </S.LinkColumn>

          <S.LinkColumn>
            <S.ColumnTitle>Linguagens</S.ColumnTitle>
            <S.LinkList>
              <S.LinkItem>
                <S.FooterLink to="/python">Python</S.FooterLink>
              </S.LinkItem>
              <S.LinkItem>
                <S.FooterLink to="/javascript">JavaScript</S.FooterLink>
              </S.LinkItem>
              <S.LinkItem>
                <S.FooterLink to="/java">Java</S.FooterLink>
              </S.LinkItem>
              <S.LinkItem>
                <S.FooterLink to="/csharp">C#</S.FooterLink>
              </S.LinkItem>
            </S.LinkList>
          </S.LinkColumn>

          <S.LinkColumn>
            <S.ColumnTitle>Recursos</S.ColumnTitle>
            <S.LinkList>
              <S.LinkItem>
                <S.FooterLink to="/blog">Blog</S.FooterLink>
              </S.LinkItem>
              <S.LinkItem>
                <S.FooterLink to="/documentacao">Documentação</S.FooterLink>
              </S.LinkItem>
              <S.LinkItem>
                <S.FooterLink to="/tutoriais">Tutoriais</S.FooterLink>
              </S.LinkItem>
              <S.LinkItem>
                <S.FooterLink to="/faq">FAQ</S.FooterLink>
              </S.LinkItem>
            </S.LinkList>
          </S.LinkColumn>

          <S.LinkColumn>
            <S.ColumnTitle>Empresa</S.ColumnTitle>
            <S.LinkList>
              <S.LinkItem>
                <S.FooterLink to="/sobre">Sobre Nós</S.FooterLink>
              </S.LinkItem>
              <S.LinkItem>
                <S.FooterLink to="/carreiras">Carreiras</S.FooterLink>
              </S.LinkItem>
              <S.LinkItem>
                <S.FooterLink to="/contato">Contato</S.FooterLink>
              </S.LinkItem>
              <S.LinkItem>
                <S.FooterLink to="/parceiros">Parceiros</S.FooterLink>
              </S.LinkItem>
            </S.LinkList>
          </S.LinkColumn>

          <S.LinkColumn>
            <S.ColumnTitle>Suporte</S.ColumnTitle>
            <S.LinkList>
              <S.LinkItem>
                <S.FooterLink to="/ajuda">Central de Ajuda</S.FooterLink>
              </S.LinkItem>
              <S.LinkItem>
                <S.FooterLink to="/termos">Termos de Uso</S.FooterLink>
              </S.LinkItem>
              <S.LinkItem>
                <S.FooterLink to="/privacidade">Privacidade</S.FooterLink>
              </S.LinkItem>
              <S.LinkItem>
                <S.EmailText>suporte@devquest.com</S.EmailText>
              </S.LinkItem>
            </S.LinkList>
          </S.LinkColumn>
        </S.LinksGrid>

        <S.Divider>
          <S.SocialMediaContainer>
            <S.SocialLink
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              $hoverColor="#ffffff"
            >
              <FaGithub />
            </S.SocialLink>
            <S.SocialLink
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              $hoverColor="#0077b5"
            >
              <FaLinkedin />
            </S.SocialLink>
            <S.SocialLink
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              $hoverColor="#1da1f2"
            >
              <FaXTwitter />
            </S.SocialLink>
            <S.SocialLink
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              $hoverColor="#ff0000"
            >
              <FaYoutube />
            </S.SocialLink>
            <S.SocialLink
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              $hoverColor="#e1306c"
            >
              <FaInstagram />
            </S.SocialLink>
            <S.SocialLink
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              $hoverColor="#1877f2"
            >
              <FaFacebook />
            </S.SocialLink>
          </S.SocialMediaContainer>

          <S.Copyright>
            Copyright © 2025 DevQuest. Todos os direitos reservados. | Feito com
            💙 para desenvolvedores
          </S.Copyright>
        </S.Divider>
      </S.FooterContent>
    </S.FooterContainer>
  );
}
