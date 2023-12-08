class Biblioteca {
	constructor() {
		this.usuarios = [];
		this.acervo = [];
		this.popularUsuarios();
		this.popularAcervo();
	}

	async popularUsuarios() {
		try {
			const response = await fetch(
				"https://api-biblioteca-mb6w.onrender.com/users"
			);
			const data = await response.json();

			for (let usuario of data) {
				this.usuarios.push(
					new Usuario(
						usuario.nome,
						usuario.registroAcademico,
						usuario.dataNascimento
					)
				);
			}
		} catch (error) {
			console.error("Erro:", error);
		}
	}

	listarUsuarios() {
		console.log(this.usuarios);
	}

	adicionarUsuario(nome, registroAcademico, dataNascimento) {
		for (let i = 0; i < this.usuarios.length; i++) {
			if (this.usuarios[i].registroAcademico === registroAcademico) {
				alert("Registro Acadêmico já em uso");
				return;
			}
		}
		this.usuarios.push(new Usuario(nome, registroAcademico, dataNascimento));
		console.log("Usuário adicionado com sucesso");
	}

	async popularAcervo() {
		try {
			const response = await fetch(
				"https://api-biblioteca-mb6w.onrender.com/acervo"
			);
			const data = await response.json();

			this.acervo = data.map((item) => {
				if (item.edicao) {
					return new Revista(
						item.codigo,
						item.titulo,
						item.autor,
						item.anoPublicacao,
						item.edicao
					);
				} else {
					return new Livro(
						item.codigo,
						item.titulo,
						item.autor,
						item.anoPublicacao,
						item.genero
					);
				}
			});
		} catch (error) {
			console.error("Erro:", error);
		}
	}

	listarAcervo() {
		console.log(this.acervo);
	}

	adicionarItem(codigo, titulo, autor, ano, edicao, genero) {
		if (this.acervo.find((item) => item.codigo === codigo)) {
			alert("Código já em uso");
			return;
		}
		if (genero) {
			this.acervo.push(new Livro(codigo, titulo, autor, ano, genero));
			console.log("Livro adicionado com sucesso");
		} else {
			this.acervo.push(new Revista(codigo, titulo, autor, ano, edicao));
			console.log("Revista adicionada com sucesso");
		}
	}

	emprestarItem(codigo, registroAcademico) {
		const item = this.acervo.find((item) => item.codigo === codigo);

		if (item) {
			const usuarioEmprestimo = this.usuarios.find(
				(usuario) => usuario.registroAcademico === registroAcademico
			);

			if (usuarioEmprestimo) {
				item.emprestar(usuarioEmprestimo);
				console.log("Livro emprestado com sucesso!");
			} else {
				console.log("Usuário não encontrado");
			}
		} else {
			console.log("Livro não encontrado");
		}
	}

	devolverItem(codigo) {
		const item = this.acervo.find((item) => item.codigo === codigo);

		if (item) {
			item.emprestado = false;
			item.usuarioEmprestimo = null;
			console.log("Item devolvido com sucesso");
		} else {
			console.log("Item não encontrado");
		}
	}
}

class Usuario {
	constructor(nome, registroAcademico, dataNascimento) {
		this.nome = nome;
		this.registroAcademico = registroAcademico;
		this.dataNascimento = dataNascimento;
	}
}

class EntidadeBibliografica {
	constructor(codigo, titulo, autor, ano) {
		this.codigo = codigo;
		this.titulo = titulo;
		this.autor = autor;
		this.ano = ano;
		this.emprestado = false;
		this.usuarioEmprestimo = null;
	}

	emprestar(usuario) {
		if (!this.emprestado) {
			this.emprestado = true;
			this.usuarioEmprestimo = usuario;
		} else {
			console.log("Alguem já pegou esse item emprestado");
		}
	}
}

class Livro extends EntidadeBibliografica {
	constructor(codigo, titulo, autor, ano, genero) {
		super(codigo, titulo, autor, ano);
		this.genero = genero;
	}

	informacoes(codigo) {
		let item = this.acervo.find((item) => item.codigo === codigo);
		if (item) {
			console.log(item);
		} else {
			console.log("Item não encontrado");
		}
	}
}

class Revista extends EntidadeBibliografica {
	constructor(codigo, titulo, autor, ano, edicao) {
		super(codigo, titulo, autor, ano);
		this.edicao = edicao;
	}

	informacoes() {
		console.log(
			`Código: ${this.codigo}\nTítulo: ${this.titulo}\nAutor: ${this.autor}\nAno: ${this.ano}\nEdição: ${this.edicao}`
		);
	}
}

const biblioteca = new Biblioteca();
