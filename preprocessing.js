const fs = require('fs')
const {hashCode} = require('./hashtbl')
Object.defineProperty(Array.prototype, 'flat', {
    value: function(depth = 1) {
      return this.reduce(function (flat, toFlatten) {
        return flat.concat((Array.isArray(toFlatten) && (depth>1)) ? toFlatten.flat(depth-1) : toFlatten);
      }, []);
    }
});
let get_language_info = (language_file) => {
  let path = `./language_files/${language_file}`
  let rawdata = fs.readFileSync(path);
  let json = JSON.parse(rawdata);
  return {
    keywords: json.keywords,
    spec_chars: json['special characters'],
    comment_info: {
      single_comment: json.comment,
      multi_comment_start: json['comment-start'],
      multi_comment_end: json['comment-end'],
      nest: json['comments-nest'],
      strings: json.strings
    }
  }
}

let rem_white_space = (code_string) => {
  return code_string.split(/\s+/).filter(s => s != '')
}

let split_and_keep_on_spec_chars = (spec_chars, str) => {
  let sp = spec_chars.join('').replace(/\[/g, '\\[').replace(/\]/g, '\\]')
  return str.split(new RegExp(`([${sp}])`)).filter((s) => s != "")
}

let split_on_str = (str_to_split_on, acc_str_arr, str_to_split) => {
  str_to_split_on = str_to_split_on.replace(/\(/g, '\\\(').replace(/\)/g, '\\\)').replace(/\*/g, '\\*')
  return acc_str_arr.concat(str_to_split.split(new RegExp(`(${str_to_split_on})`)))
}

let remove_strings = (code_str) => {
  return code_str.replace(/""|''/g, '').replace(/"[^"]*"/g, 's').replace(/'[^']*'/g, 's')
}

let remove_comments = (comment_start, comment_end, comments_nest, code_str) => {
  let split_on_comments_arr = split_on_str(comment_start, [], code_str);
  let temp =split_on_comments_arr.map((s)=> {
    return split_on_str(comment_end, [], s)
  })
  split_on_comments_arr = temp.flat()
  let acc_arr = [], nesting = 0
  for(let str of split_on_comments_arr) {
    if(str == comment_start) {
      acc_arr.push(' ');
      if(comments_nest) {
        nesting += 1;
      }
      else {
        nesting = 1;
      }
    } else if(str == comment_end) {
      acc_arr.push(' ')
      if(comments_nest) {
        nesting -= 1;
      }
      else {
        nesting = 0;
      }
    } else {
      if(nesting == 0) {
        acc_arr.push(str)
        acc_arr.push(' ')
      }
    }
  }
  return acc_arr;
}

let replace_generics = (keywords, spec_chars, str_arr) => {
  return str_arr.map((str) => {
    if(keywords.indexOf(str) != -1 || (str.length == 1 && spec_chars.indexOf(str) != -1)) {
      return str
    }
    else {
      if(isNaN(+str)) {
        return 'v'
      }
      else {
        return str
      }
    }
  })
}

let remove_noise = (comment_info, code_string, keywords, spec_chars, is_txt) => {
  if(is_txt) return code_string
  let rm_one_line_comment = (s) => {
    if(comment_info.single_comment == '') return s;
    return remove_comments(comment_info.single_comment, "\n", false, s).join('')
  }
  let rm_mult_line_comment = (s) => {
    if(comment_info.multi_comment_start == "") return s;
    return remove_comments(comment_info.multi_comment_start, comment_info.multi_comment_end, comment_info.nest, s).join('')
  }
  let rm_strings = (s) => {
    if(comment_info.strings) return remove_strings(s)
    return s
  }
  let temp = (rm_one_line_comment(rm_mult_line_comment(rm_strings(code_string))))
  let temp2 = (split_and_keep_on_spec_chars(spec_chars, temp))
  let temp3 = temp2.map((t) => {
    return rem_white_space(t)
  }).flat()
  let temp4 = replace_generics(keywords, spec_chars, temp3)
  return temp4.join('')
}

let k_grams = (s, k) => {
  let acc = []
  for(let i = 0; i < s.length + 1 - k; i++){
    acc.push(s.substr(i, k))
  }
  return acc;
}

let determine_language_file = (f) => {
  if(f.endsWith('txt')) return "txt_info.json"
  if(f.endsWith('c')) return "c_info.json"
  if(f.endsWith('java')) return "java_info.json"
  if(f.endsWith('py')) return "python_info.json"
  if(f.endsWith('ml')) return "ocaml_info.json"
  if(f.endsWith('mli')) return "ocaml_info.json"
  console.log('This file format is not supported yet')
}

let get_ngrams = (f_string, n, language_file) => {
  let language_info = get_language_info(language_file)
  let keywords = language_info.keywords
  let spec_chars = language_info.spec_chars
  let is_txt = language_file == 'txt_info.json'
  let com_info = language_info.comment_info
  let noise_removed_str = remove_noise(com_info, f_string, keywords, spec_chars, is_txt);
  return k_grams(noise_removed_str, n)
}

let hash_file = (f) => {
  let language_file = determine_language_file(f)
  let f_string = fs.readFileSync(f, {encoding:'utf8', flag:'r'});
  let n_grams = get_ngrams(f_string, 35, language_file)
  return n_grams.map((g) => hashCode(g))
}

let hash_coco_session = (s) => {
  let language_file = s.language + '_info.json'
  let n_grams = get_ngrams(s.code, 35, language_file)
  return n_grams.map((g) => hashCode(g))
}

let get_file_positions = (dir, dir_name, filename, positions) => {
  
}

module.exports = {
  get_ngrams,
  hash_file,
  k_grams,
  remove_noise,
  get_language_info
}