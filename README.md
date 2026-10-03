```
 __        ___ _ _ _                    ____ _ _                     
 \ \      / (_) | (_) __ _ _ __ ___    / ___(_) |__  ___  ___  _ __  
  \ \ /\ / /| | | | |/ _` | '_ ` _ \  | |  _| | '_ \/ __|/ _ \| '_ \ 
   \ V  V / | | | | | (_| | | | | | | | |_| | | |_) \__ \ (_) | | | |
 __ \_/\_/ _|_|_|_|_|\__,_|_| |_|_|_|  \____|_|_.__/|___/\___/|_| |_|
 \ \      / /__  _ __ __| |  / ___| __ _ _ __ ___   ___  ___         
  \ \ /\ / / _ \| '__/ _` | | |  _ / _` | '_ ` _ \ / _ \/ __|        
   \ V  V / (_) | | | (_| | | |_| | (_| | | | | | |  __/\__ \        
    \_/\_/ \___/|_|  \__,_|  \____|\__,_|_| |_| |_|\___||___/        
                                                    
```

# Spec

Create two word games based on the works of William Gibson for a player who's read them all. Make a crossword puzzle and a word search. Intend to print the puzzles out and complete them with a pencil. Then want to return the interactive SPAs, fill in answers and see if I got it right. Produce 40 clues. Try to avoid a sprawling, spaced-out crossword layout. The clue answers from the crossword is the list of hidden words in the word search. Clues can be the names of books, names of characters, companies, bands or locations. Example clue: "Virtal Light's by-way, interrupted". Answer: BAYBRIDGE. Example clue: "Peripheral's friendly klept". Answer: LEVZUBOV.
# Playing

Open [index.html](index.html) in a browser. No server or build step is needed.

- **[crossword.html](crossword.html)**: press **Print blank** to get the grid on page 1 and the clues on page 2. Later, type your letters into the grid and press **Check all** (marks wrong letters), **Check word**, or **Reveal word**. Click a cell twice, or press Space, to switch between across and down. Tab moves to the next clue.
- **[wordsearch.html](wordsearch.html)**: press **Print blank**. Later, drag from the first letter of a word to the last; correct finds are struck from the list. Switch the list to **Clues** if you do the word search first and don't want the crossword answers spoiled.

Progress is saved in your browser's localStorage.

# Regenerating

Clues and the candidate answer pool live in [tools/words.js](tools/words.js). The generator picks the 40 answers that pack into the most compact crossword (the `required` entries are always used), then hides the same 40 in the word search:

```
node tools/generate.js [--seed 4] [--trials 1500]
```

This rewrites `assets/puzzle-data.js`. A different seed gives a different puzzle, and saved progress is tracked per seed.
