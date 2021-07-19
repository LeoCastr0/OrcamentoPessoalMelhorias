class Despesa {
	constructor (ano, mes, dia, tipo, descricao, valor){
		this.ano = ano
		this.mes = mes
		this.dia = dia
		this.tipo = tipo
		this.descricao = descricao
		this.valor = valor
	}

	validarDados(){
		for(let i in this){
			if (this[i] === undefined || this[i] === '' || this[i] === null) {
				return false
			}
		}
		if (this.dia > 31 || this.dia < 1) {
			return false
		}
		return true
	}  	
}

class Bd{

	constructor (){
		let id = localStorage.getItem('id')

		if (id === null) {
			localStorage.setItem('id', 0)
		}
	}

	getProximoId(){
		let proximoId = localStorage.getItem('id') //getItem recupera um indice do localStorage
		return parseInt(proximoId) + 1
	}

	gravar(d){
		//setItem - sempre que inserida, irá sobrepor a existente, caso não tenha lógica de tratativa
		let id = this.getProximoId()

		localStorage.setItem(id, JSON.stringify(d))
		localStorage.setItem('id', id)
	}

	recuperarTodosRegistros(){
		//array de despesas
		let despesas = Array()

		let id = localStorage.getItem('id')

		//recuperar todas as despesas cadastradas em localStorage
		for (let i = 1; i <= id; i++){
			//recuperar a despesa e convertendo string JSON para objeto literal
			let despesa = JSON.parse(localStorage.getItem(i))

			//verificar se existe a possibilidade de haver indices que foram pulados/ removidos
			// neste cadso nos vamos pular esses incides
			if (despesa === null) {
				continue
			}

			despesa.id = i
			//inserindo valores de uma variavel dentro do Array
			despesas.push(despesa)

		}
		return despesas
	}

	pesquisar(despesa){
		
		let despesasFiltradas = Array
		
		despesasFiltradas = this.recuperarTodosRegistros()

		

		//console.log(despesa)

		//console.log(despesasFiltradas)

		//ano 
		if(despesa.ano != ''){
			//console.log('Filtro de ano')
			despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
		}
		//mes
		if(despesa.mes != ''){
			//console.log('Filtro de mês')
			despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
		}
		//dia
		if(despesa.dia != ''){
			//console.log('Filtro de dia')
			despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
		}

		//tipo
		if(despesa.tipo != ''){
			//console.log('Filtro de tipo')
			despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
		}

		//descricao
		if(despesa.descricao != ''){
			//console.log('Filtro de Descrição')
			despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
		}

		//valor
		if(despesa.valor != ''){
			//console.log('Filtro de valor')
			despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
		}

		return despesasFiltradas
	}

	remover(id){
		localStorage.removeItem(id)
	}

}

let bd = new Bd()

function cadastrarDespesa(){
	
	let ano = document.getElementById('ano')
	let mes = document.getElementById('mes')
	let dia = document.getElementById('dia')
	let tipo = document.getElementById('tipo')
	let descricao = document.getElementById('descricao')
	let valor = document.getElementById('valor')

	
	
	let despesa = new Despesa (ano.value, mes.value, dia.value, tipo.value, descricao.value, valor.value)


	if (despesa.validarDados()){
		bd.gravar(despesa)

		// atribuindo ao modal em HTML o titulo devido a situação
		document.getElementById('modal_titulo').innerHTML = 'Registro inserido com sucesso!'
		// atribuindo a div do titulo o tipo do modal e a cor de acordo com a class e situação.
		document.getElementById('modal_titulo_div').className ="modal-header text-success"
		// atribuindo o texto do dialogo exibido na tela, de acordo com a situação
		document.getElementById('modal_conteudo').innerHTML = 'Despesa foi cadastrada com sucesso!'
		// atribuindo cor ao botão voltar e texto
		document.getElementById('modal_btn').innerHTML = 'Voltar'
		document.getElementById('modal_btn').className = 'btn btn-success'
		//dialog sucesso
		$('#modalRegistraDespesa').modal('show')

		//limpando os campos do formulário quando a gravação for efetuada com sucesso.
		ano.value = ''
		mes.value = ''
		dia.value = ''
		tipo.value = ''
		descricao.value = ''
		valor.value = ''
	}else{
		
		document.getElementById('modal_titulo').innerHTML = 'Erro na inclusão do registro!'

		document.getElementById('modal_titulo_div').className ="modal-header text-danger"

		document.getElementById('modal_conteudo').innerHTML = 'Erro na gravação, verifique se todos os campos foram preenchidos corretamente.'

		document.getElementById('modal_btn').innerHTML = 'Voltar e corrigir'
		document.getElementById('modal_btn').className = 'btn btn-danger'
		//dialog de erro
		$('#modalRegistraDespesa').modal('show')


	}
		
}

function carregaListaDespesas(despesas = Array(), filtro = false){

	if(despesas.lenght == 0 && filtro == false){
		despesas = bd.recuperarTodosRegistros()
	}

	//selecionando o elemento tbody da tabela
	let listaDespesas = document.getElementById('listaDespesas')

	listaDespesas.innerHTML = ''
	/*
		<tr>
          0 = <td>15/03/2021</td>
          1 = <td>Alimentação</td>
          2 = <td>Compra do mês</td>
          3 = <td>444.75</td>
        </tr>
	*/



	//percorrer o array despesas, listando cada despesa de forma dinâmica

	despesas.forEach(function(d){
		
		//criando a linha (tr)
		linha = listaDespesas.insertRow()

		
		

		//Ajustar o tipo
		switch(d.tipo){
			case '1': d.tipo = 'Alimentação'
			break
			case '2': d.tipo = 'Educação'
			break
			case '3': d.tipo = 'Lazer'
			break
			case '4': d.tipo = 'Saúde'
			break
			case '5': d.tipo = 'Transporte'
			break
		}

		//inserindo valores, criando as colunas (td)

		linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`
		linha.insertCell(1).innerHTML = d.tipo
		linha.insertCell(2).innerHTML = d.descricao
		linha.insertCell(3).innerHTML = d.valor

		// criar o botão de exclusão
		let btn = document.createElement("button")
		btn.className = 'btn btn-danger'
		btn.innerHTML = '<i class = "fas fa-times"></i>'
		btn.id = `id_despesa_${d.id}` 
		btn.onclick = function() {
			//remover a despesa
			
			//substituindo id_despesa_ para vazio, de forma que só recuperemos o indice do id
			let id = this.id.replace('id_despesa_','')

			bd.remover(id)

			//Modal de exclusão de despesa
			document.getElementById('modal_titulo').innerHTML = 'Despesa excluída!'

			document.getElementById('modal_titulo_div').className ="modal-header text-success"

			document.getElementById('modal_conteudo').innerHTML = `Despesa foi excluída com sucesso!`

			document.getElementById('modal_btn').innerHTML = 'continuar'
			document.getElementById('modal_btn').className = 'btn btn-success'
		
			//dialog de remoção com sucesso
			$('#modalDeletaDespesa').modal('show')

			//window.location.reload()

			//alert('Item removido com sucesso')

		}
		linha.insertCell(4).append(btn)

		//console.log(d)

	})

		//gerar total
		let total = 0
		
		//valida em despesas o total

		despesas.forEach(function(item){
			
			total += Number(item.valor)
			// arredondando para 2 casas após a virgula
			total = parseFloat(total.toFixed(2))

			
		})

		document.getElementById('total').innerHTML = `Total de despesas: ${total}`
}

function pesquisarDespesa(){
	let ano = document.getElementById('ano').value
	let mes = document.getElementById('mes').value
	let dia = document.getElementById('dia').value
	let tipo = document.getElementById('tipo').value
	let descricao = document.getElementById('descricao').value
	let valor = document.getElementById('valor').value

	let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

	let despesas = bd.pesquisar(despesa)

	//chamando a função carregaListaDespesas, passando como parametro as despesas recuperadas.

	carregaListaDespesas(despesas, true)
}


