build-latex:
	pdflatex -shell-escape -synctex=1 -interaction=nonstopmode -file-line-error -recorder  "main.tex"
	bibtex main
	pdflatex -shell-escape -synctex=1 -interaction=nonstopmode -file-line-error -recorder  "main.tex"
