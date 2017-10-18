CREATE FUNCTION `strSplit`(x varchar(255), delim varchar(12), pos int) RETURNS varchar(255) CHARSET latin1
    DETERMINISTIC
BEGIN
   RETURN replace(substring(substring_index(x, delim, pos),
      length(substring_index(x, delim, pos - 1)) + 1), delim, '');

-- end the stored function code block
END
