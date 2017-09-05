package com.sap.pia.producer;


import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;
import javax.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class AppUtility {

	/**
	 * Static constant Logger object used for adding various logs .
	 */
	private static final Logger LOGGER = LoggerFactory
			.getLogger(AppUtility.class);
	
	/**
	 * Static Properties object used for reading properties.
	 */
	private static Properties configProperties= null;

	/**
	 * Static map object which will store the values read from properties file in key ,value pair of
	 * string
	 */
	private static Map<String, String> propertiesMap= null;
	
	/**
	 * Static String object which will store the response message which will send to client
	 */
	public static String responseMessage = null;
	
	/**
	 * This method is used to close the connection safely and reports problem if
	 * some error occurs
	 * 
	 * @param connection
	 *            object which needs to be closed
	 */
	public static void safeClose(Connection connection) {
		if (connection != null) {
			try {
				connection.close();
			} catch (SQLException e) {
				LOGGER.error("safeClose:Unable to close connection");
			}
		}

	}
	
	/**
	 * This method is used to close the connection safely and reports problem if
	 * some error occurs
	 * 
	 * @param stmt
	 *            object which needs to be closed
	 */
	public static void safeClose(PreparedStatement stmt) {
		if (stmt != null) {
			try {
				stmt.close();
			} catch (SQLException e) {
				LOGGER.error("safeClose:Unable to close connection");
			}
		}

	}
	
	/**
	 * This method is used to close the connection safely and reports problem if
	 * some error occurs
	 * 
	 * @param stmt
	 *            object which needs to be closed
	 */
	public static void safeClose(Statement stmt) {
		if (stmt != null) {
			try {
				stmt.close();
			} catch (SQLException e) {
				LOGGER.error("safeClose:Unable to close connection");
			}
		}

	}
	
	/**
	 * This method is used to close the connection safely and reports problem if
	 * some error occurs
	 * 
	 * @param rs
	 *            object which needs to be closed
	 */
	public static void safeClose(ResultSet rs) {
		if (rs != null) {
			try {
				rs.close();
			} catch (SQLException e) {
				LOGGER.error("safeClose:Unable to close connection");
			}
		}

	}
	
	/**
	 * This method is similar to {@link #safeClose(Connection)} but it is used to close the
	 * InputStream safely and reports problem if some error occurs
	 * 
	 * @param rs
	 *            object which needs to be closed
	 */
	public static void safeClose(InputStream is)
	{
		if(is != null)
		{
			try
			{
				is.close();
			}
			catch(IOException e)
			{
				LOGGER.error("safeClose:Unable to close InputStream");
			}
		}

	}
	
	/**
	 * This method is a helper function which is used to print stack trace in
	 * sting format
	 * 
	 * @param Throwable
	 *            object which contains the stack trace
	 * @return String stack trace converted into string object
	 */
	public static String getStackTrace(Throwable ex) {
		String stackTrace = "Exception message [" + ex.getMessage() + "]\r\nStackTrace=\r\n";
		StackTraceElement[] ar = ex.getStackTrace();
		for (StackTraceElement ste : ar) {
			stackTrace += ste.toString() + "\r\n";
		}
		return stackTrace;
	}
	
	/**
	 * getPropertiesMap() Method is used to read the values stored in the properties file and store
	 * them in program memory as Hashmap
	 * 
	 * @return
	 *         map object which contains the properties file content read as key,value pair
	 * @throws IOException
	 *             Signals that an I/O exception of some sort has occurred
	 */
	public static Map<String, String> getPropertiesMap()
	{
		if(null == configProperties)
		{
			configProperties= new Properties();
		}
		if(null == propertiesMap)
		{
			propertiesMap= new HashMap<String, String>();
		}
		InputStream input = null;
		if(propertiesMap.isEmpty())
		{
			try
			{
				input= AppUtility.class.getClassLoader().getResourceAsStream("/UsageCloud.properties");
				configProperties.load(input);
				for(String key : configProperties.stringPropertyNames())
				{
					String value= configProperties.getProperty(key);
					propertiesMap.put(key, value);
				}
			}
			catch(IOException e)
			{
				LOGGER.error(AppUtility.getStackTrace(e));
			}
			finally
			{
				AppUtility.safeClose(input);
			}
		}

		return propertiesMap;
	}

	
	public static void writeToResponse(HttpServletResponse response) throws IOException {
		
		OutputStream os = null;
		try {
			response.setContentType("text/plain");
			response.setCharacterEncoding("utf8");
			byte[] content= AppUtility.responseMessage.getBytes("utf8");
			os = response.getOutputStream();
			os.write(content);
			
		}
		finally {
			os.flush();
			os.close();
		}
		
		
	}
	
}
