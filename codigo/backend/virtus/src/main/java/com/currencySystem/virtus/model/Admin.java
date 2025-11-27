package com.currencySystem.virtus.model;

import jakarta.persistence.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "admins")
@PrimaryKeyJoinColumn(name = "usuario_id")
public class Admin extends Usuario {

    @Column(nullable = false, length = 200)
    private String nome;

    @Column(nullable = false, unique = true, length = 200)
    private String email;

    @Column(nullable = false, unique = true, length = 11)
    private String cpf;

    public Admin(String login, String senha, String nome, String email, String cpf) {
        this.setLogin(login);
        this.setSenha(senha);
        this.setTipo(TipoUsuario.ADMIN);
        this.nome = nome;
        this.email = email;
        this.cpf = cpf;
        this.setAtivo(true);
    }

    @Override
    public void autenticar() {
        // Admin authentication logic
    }
}
